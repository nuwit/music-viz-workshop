import Visualizer from "./classes/visualizer";
import { interpolateBasis, interpolateRgb } from "d3-interpolate";
import { getRandomElement } from "./util/array";

export default class Final extends Visualizer {
  constructor() {
    super({ volumeSmoothing: 100 });
    this.heights = [];
    this.barNum = 200;
    //let's make the rectangles look different
    for (let j = 0; j < this.barNum; j++) {
      this.heights.push(this.getRandomInt(100));
    }
    this.theme = ["#18FF2A", "#7718FF", "#06C5FE", "#FF4242", "#18FF2A"];
    this.direction = 1;
  }

  hooks() {
    this.sync.on("bar", beat => {
      this.lastColor = this.nextColor || getRandomElement(this.theme);
      this.nextColor = getRandomElement(
        this.theme.filter(color => color !== this.nextColor)
      );
      this.direction = this.direction * -1;
    });
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  paint({ ctx, height, width, now }) {
    //without this, we'd get some very sudden and jittery beats
    const beat = interpolateBasis([0, this.sync.volume * 100, 0])(
      this.sync.beat.progress
    );

    //background
    // ctx.fillStyle = 'rgba(0, 0, 0, .08)';
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);

    //rendering rectangles
    const rectWidth = width / this.barNum;
    for (let i = 0; i < this.barNum; i++) {
      ctx.fillStyle = interpolateRgb(
        this.lastColor,
        this.nextColor
      )(this.sync.bar.progress);
      ctx.fillRect(
        i * rectWidth,
        0,
        rectWidth,
        this.heights[i] +
          height / 2 +
          this.sync.volume * 1.2 * beat * (i % 2 == 0 ? -1 : 1) * this.direction
      );
    }

    //song info
    ctx.font = "15px Open Sans";
    ctx.fillStyle = "white";
    ctx.fillText("Now Playing ♬", 20, height - 78);
    ctx.font = "30px Open Sans";
    ctx.fillStyle = "white";
    ctx.fillText(this.sync.state.currentlyPlaying.name, 20, height - 45);
    ctx.font = "20px Open Sans";
    ctx.fillStyle = "white";
    ctx.fillText(
      this.sync.state.currentlyPlaying.artists[0].name,
      20,
      height - 20
    );
  }
}
