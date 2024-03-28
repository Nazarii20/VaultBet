/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import { CrashEngine, CrashEngineState } from "./CrashEngine";
import PlanImage from "../../../../../assets/images/rocket.png";
import chartBg from '@assets/images/crash-game-gield-bg.png';
import historyIcon from '@assets/icons/ic-history.svg';
import { v4 as uuidv4 } from 'uuid';

interface ChartProps {
  width: any;
  height: any;
  globalTimeNow: any;
  crashEngineState: string;
  crashHistory: any;
  liveMultiplier: string;
  liveMultiplierSwitch: boolean;
}
const CrashChart = ({
  width,
  height,
  globalTimeNow,
  crashEngineState,
  crashHistory,
  liveMultiplier,
  liveMultiplierSwitch,
}: ChartProps) => {
  const canvasReference = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<CrashEngine>();
  const timerRef = useRef<number>();
  const isComponentMounted = useRef(false);
  const planSizeRef = useRef({ width: 130, height: 130 });
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const isCrashedRef = useRef(false);

  useEffect(() => {
    const isCrahedValue = !liveMultiplierSwitch &&
    liveMultiplier !== "Starting..." &&
    liveMultiplier !== "CONNECTING...";

    
    if (isCrahedValue) {
      isCrashedRef.current = true;
    }
    
    if (!isCrahedValue) {
      isCrashedRef.current = false;
    }
    // console.log(isCrashedRef.current, 'CRASHED VALUECrahedValueisCrahedValueisCrahedValueisCrahedValue')
  }, [liveMultiplier, liveMultiplierSwitch]);

  useEffect(() => {
    window.addEventListener('resize', () => setScreenWidth(window.innerWidth));

    return () => {
      window.removeEventListener('resize', () => setScreenWidth(window.innerWidth));
    };
  }, []);

  useEffect(() => {
    if (screenWidth <= 900) {
      planSizeRef.current = { width: 70, height: 70 }
    } 

    if (screenWidth > 900) {
      planSizeRef.current = { width: 130, height: 130 }
    }
  }, [screenWidth]);

  useEffect(() => {
    isComponentMounted.current = true;
    engineRef.current = new CrashEngine();
    engineRef.current.startTime = globalTimeNow;
    engineRef.current.onResize(
      canvasReference.current!.width,
      canvasReference.current!.height
    );
    engineRef.current.state =
      crashEngineState === "active"
        ? CrashEngineState.Active
        : crashEngineState === "loading"
          ? CrashEngineState.Loading
          : CrashEngineState.Over;

          if (crashEngineState !== "over") {
            timerRef.current = requestAnimationFrame(tick) as any as number;
          }
    return () => {
      isComponentMounted.current = false;
      if (timerRef.current) {
        cancelAnimationFrame(timerRef.current);
      }
      if (engineRef.current) {
        engineRef.current.destroy();
      }
    };

  }, [crashEngineState]);

  const stepValues = (multiplier: number, e: number = 5, n: number = 2) => {
    for (let i = 0.4, r = 0.1; ;) {
      if (multiplier < i) {
        return r;
      }
      r *= n;
      i *= e;
      if (multiplier < i) {
        return r;
      }
      r *= e;
      i *= n;
    }
  };

  // function rotateAndPaintImage ( context: any, image: any, angleInRad: any , positionX: any, positionY: any, axisX: any, axisY: any ) {
  //   context.translate( positionX, positionY );
  //   context.rotate( angleInRad );
  //   context.drawImage( image, -axisX, -axisY );
  //   context.rotate( -angleInRad );
  //   context.translate( -positionX, -positionY );
  // }

  const tick = () => {
    if (!canvasReference.current || !isComponentMounted.current) {
      return;
    }

    engineRef.current!.tick();
    const ctx = canvasReference.current.getContext("2d");
    if (ctx) {
      ctx.clearRect(
        0,
        0,
        engineRef.current!.graphWidth,
        engineRef.current!.graphHeight
      );
      ctx.beginPath();

      ctx.strokeStyle = isCrashedRef.current ? "#FF403C" : "#8739F2";


      ctx.lineWidth = 4;
      const a = engineRef.current!.getElapsedPosition(
        engineRef.current!.elapsedTime
      );
      const b = engineRef.current!.getElapsedPosition(
        engineRef.current!.elapsedTime / 2
      );
      ctx.moveTo(50, engineRef.current!.plotHeight);
      ctx.quadraticCurveTo(b.x, b.y, a.x, a.y);
      ctx.stroke();

      // Fill the area under the curve
      ctx.lineTo(a.x, engineRef.current!.plotHeight); // Draw a line to the bottom
      ctx.lineTo(0, engineRef.current!.plotHeight); // Draw a line to the starting point
      ctx.closePath();
      // const fillOpacity = 0.3;
      // ctx.fillStyle = `rgba(134, 58, 242, ${fillOpacity})`;

      const gradient = ctx.createLinearGradient(450, 86.6551, 450, 569);

      gradient.addColorStop(0, '#9747FF');
      gradient.addColorStop(1, 'rgba(70, 57, 125, 0)');

      ctx.fillStyle = gradient;
      ctx.fill();

      // draw icon
      const iconImage = new Image();
      iconImage.src = PlanImage;
      const iconWidth = planSizeRef.current.width;
      const iconHeight = planSizeRef.current.height;
      const lineEndpoint = engineRef.current!.getElapsedPosition(
        engineRef.current!.elapsedTime
      );

      const iconX = Math.max(
        0,
        Math.min(
          lineEndpoint.x - iconWidth / 2,
          engineRef.current!.graphWidth - iconWidth
        )
      );

      let endPoint = Math.min(
        lineEndpoint.y - iconHeight / 2,
        engineRef.current!.plotHeight - iconHeight
      );

      if (crashEngineState == "over" && engineRef.current!.yAxis <= 1.5) {
        iconX + 50;
      }

      if (engineRef.current!.yAxis <= 1.5) {
        endPoint = endPoint + 15;
      }

      if (engineRef.current!.yAxis > 11) {
        endPoint = endPoint - 50;
      }
      const iconY = Math.max(0, endPoint);

      // const TO_RADIANS = Math.PI/180; 

      if (crashEngineState !== "loading") {
        // rotateAndPaintImage ( ctx, iconImage, 45*TO_RADIANS, iconX, iconY, iconWidth, iconHeight);
        // rotateAndPaintImage ( ctx, iconImage, 45*TO_RADIANS, 200, 100, 20, 30 );
        // context: any, image: any, angleInRad: any , positionX: any, positionY: any, axisX: any, axisY: any
        ctx.drawImage(iconImage, iconX, iconY, iconWidth, iconHeight);
      }

      ctx.font = "10px sans-serif";
      ctx.fillStyle = "#8C8C8C";
      ctx.strokeStyle = "#777";
      // ctx.strokeStyle = "#32353C";

      // draw x,y axis border
      ctx.beginPath();
      ctx.moveTo(45, 0);
      ctx.lineTo(45, engineRef.current!.plotHeight);
      ctx.lineTo(engineRef.current!.plotWidth, engineRef.current!.plotHeight);
      ctx.stroke();

      // draw y axis
      let stepOffset = stepValues(engineRef.current!.multiplier || 1);
      const stepScale =
        engineRef.current!.plotHeight / engineRef.current!.yAxis;
      const subStepOffset = stepOffset * stepScale;
      let subSteps = Math.max(
        2,
        Math.min(
          16,
          ~~(subStepOffset / Math.max(3, engineRef.current!.yAxis / stepOffset))
        )
      );
      subSteps += subSteps % 2;

      ctx.lineWidth = 0; // Adjust the line thickness
      ctx.strokeStyle = "#32353C";
      ctx.stroke();
      for (
        let offset = stepOffset, step = 0;
        offset < engineRef.current!.yAxis + stepOffset && step <= 100;
        offset += stepOffset, step++
      ) {
        const positionX = 0.5;
        const positionY = engineRef.current!.plotHeight - offset * stepScale;

        // draw caption
        const labelText =
          engineRef.current!.getYMultiplier(positionY)
            .toFixed(engineRef.current!.multiplier > 2 ? 0 : 1) + "x";
        const textSize = ctx.measureText(labelText);

        ctx.font = '14px Poppins';
        ctx.fillText(
          labelText,
          positionX + 10,
          positionY +
          (textSize.actualBoundingBoxAscent +
            textSize.actualBoundingBoxDescent) /
          2
        );
      }

      // draw x axis
      stepOffset = stepValues(engineRef.current!.xAxis, 5, 2);
      const stepScaleX =
        engineRef.current!.plotWidth / (engineRef.current!.xAxis / stepOffset);

      for (
        let step = 1, offset = 0;
        offset <= engineRef.current!.xAxis + stepOffset && step <= 100;
        offset += stepOffset, step++
      ) {

        const seconds = (offset) / 1000;
        const positionX = step === 0 ? 4 : step * stepScaleX;
        const positionY = engineRef.current!.plotHeight + 10;
        
        // draw caption
        const labelText = seconds.toFixed(0) + "s";
        const textSize = ctx.measureText(labelText);
        
        ctx.font = '14px Poppins';
        ctx.fillText(labelText, positionX - textSize.width / 2, positionY + 15);
      }
    }
    timerRef.current = requestAnimationFrame(tick) as any as number;
  };

  const finalCrashHistory = crashHistory
  const finalCrashHistoryM = crashHistory


  return (
    <div
      className="crash-chart"
    >
      <canvas
        className="crash-chart-canvas"
        style={{
          color: "white",
          display: "block",
          maxWidth: "100%",
          paddingTop: "5%",
          backgroundImage: `url(${chartBg})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'top center',
          backgroundSize: 'cover',
        }}
        ref={canvasReference}
        width={width}
        height={height}
      ></canvas>
        <div className="crash-chart-history">
          <img src={historyIcon} />
          <div style={{ display: 'flex', flexWrap: 'wrap', height: '20px', overflow: 'hidden' }}>
            {finalCrashHistory?.map((game: any, index: number) => {
                return (
                  <span
                    key={uuidv4()}
                    style={{
                      fontFamily: 'Poppins',
                      fontSize: '18px',
                      fontWeight: '500',
                      lineHeight: '22px',
                      marginLeft: '16px',
                      color: index % 2 === 0 ? "#66E094" : "#D1D1D1",
                    }}
                  >
                    {Number(game).toFixed(2)}x
                  </span>
                );
              })}
          </div>
          <span style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            zIndex: 1,
            background: 'linear-gradient(90deg, rgba(255,255,255,0) 49%, #1A1B1E 98%)',
          }}></span>
        </div>
    </div>
  );
};
export default CrashChart;
