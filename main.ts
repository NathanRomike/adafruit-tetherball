const MAX_SCORE = 8;
const SPEED_INCREASE_STEP = 50;

class Player {
    color: number;
    joystickPin: TouchButton;
    lightPosition: number;
    facesClockwise: boolean;
    score: number;
    constructor(
        color: number,
        joystickPin: TouchButton,
        lightPosition: number,
        facesClockwise: boolean
    ) {
        this.color = color;
        this.joystickPin = joystickPin;
        this.lightPosition = lightPosition;
        this.facesClockwise = facesClockwise;
        this.score = 0;
        this.setupHandlers();
    }

    setupHandlers() {
        // FIXME: This feels gross
        const player = this;
        this.joystickPin.onEvent(ButtonEvent.Click, () => {
            if (ballIndex === player.lightPosition) {
                light.fade(Colors.White, 255);
                playerInControl = player;
                music.playSoundUntilDone(music.sounds(Sounds.BaDing));
                player.score++;
                if (player.score >= MAX_SCORE) {
                    declareWinner(player);
                }
            } else {
                // TODO: Some sort of punishment debounce?
            }
        });
    }
}

const players: Player[] = [
    new Player(Colors.Green, input.pinA5, 2, false),
    new Player(Colors.Red, input.pinA2, 7, true)
];

let ballIndex: number = -1;
let playerInControl: Player;

function reset() {
    const randomPlayerIndex = Math.floor(Math.random() * players.length);
    playerInControl = players[randomPlayerIndex];

    for (let player of players) {
        player.score = 0;
    }

}

function swingBall() {
    // Clear it
    light.setPixelColor(ballIndex, Colors.Black);
    // Make sure players are showing
    for (let player of players) {
        if (light.pixelColor(player.lightPosition) === Colors.Black) {
            light.setPixelColor(player.lightPosition, player.color);
        }
    }
    if (playerInControl.facesClockwise) {
        ballIndex--;
        if (ballIndex < 0) {
            ballIndex = 9;
        }
    } else {
        ballIndex++;
        if (ballIndex >= 10) {
            ballIndex = 0;
        }
    }
    // Render the ball
    light.setPixelColor(ballIndex, Colors.Yellow);
    loops.pause(500 - (playerInControl.score * SPEED_INCREASE_STEP));
}

function declareWinner(player: Player) {
    light.showAnimation(light.theaterChaseAnimation, 1000);
    music.playSoundUntilDone(music.sounds(Sounds.MagicWand));
    reset();
}

reset();
loops.forever(swingBall);