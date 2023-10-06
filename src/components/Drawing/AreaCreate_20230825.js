import log from "../../utils/console";
import React, { useState, useEffect, useImperativeHandle, forwardRef, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Circle, Rect, Layer, Line, Stage, Image, Label, Text, Tag, Group, Draggable, useStrictMode } from "react-konva";
import Konva from 'konva';
import useImage from "use-image"
import { areaInsert } from "../../store/areas";

function Anchor(props) {
    const [strokeWidth, setStrokeWidth] = useState(4)

    return (
        <Circle
            x={props.point.x}
            y={props.point.y}
            radius={5}
            stroke="red"
            fill={props.fill}
            //fill="white"
            strokeWidth={2}
            onMouseOver={() => {
                document.body.style.cursor = "pointer"
                setStrokeWidth(4)
                props.onMouseOver()
            }}
            onMouseOut={() => {
                document.body.style.cursor = "default"
                setStrokeWidth(4)
                props.onMouseOut()
            }}
            onClick={() => {
                document.body.style.cursor = "default"
                props.onClick()
            }}
        />
    )
}

function PolygonOriginAnchor(props) {
    const isValid = props.validateMouseEvents()
    const [fill, setFill] = useState("white")

    return (
        <Anchor
            point={props.point}
            
            fill={fill}
            onClick={() => {
                if (isValid) {
                    props.onValidClick()
                }
            }}
            onMouseOver={() => {
                if (isValid) {
                    document.body.style.cursor = "pointer"
                    setFill("red")
                    props.onValidMouseOver()
                } else {
                    document.body.style.cursor = "not-allowed"
                    setFill("white")
                }
            }}
            onMouseOut={() => {
                setFill("white")
            }}
        />
    )
}


const areaCreate = forwardRef((props, ref) => {
    const [points, setPoints] = useState([])
    //const [nextPoint, setNextPoint] = useState({ x: 0, y: 0 })
    const [nextPoint, setNextPoint] = useState({ x: null, y: null})
    const [isComplete, setIsComplete] = useState(false);

    const dispatch = useDispatch();

    const handleClick = ({ x, y }) => {
        setPoints(points.concat({ x, y }))
    }

    useImperativeHandle(ref, () => ({
        setReset: () => {
            setPoints([]);
            setNextPoint({ x: null, y: null });
            setIsComplete(false);
        }
    }));

    return (
        <>
            <Line
                strokeWidth={3}
                stroke="red"
                opacity={1}
                lineJoin="round"
                closed={isComplete}
                points={points
                    .flatMap(point => [point.x, point.y])
                    .concat([nextPoint.x, nextPoint.y])}
            />

            <Line
                strokeWidth={0}
                opacity={0.16}
                fill="#E61F23"
                lineJoin="round"
                closed={true}
                points={points
                    .flatMap(point => [point.x, point.y])
                    .concat([nextPoint.x, nextPoint.y])}
            />

            {    
                points.map((item, idx) => (
                    <Circle
                        key={`point_${idx}`}
                        x={item.x}
                        y={item.y}
                        order={idx}
                        radius={5}
                        fill={'white'}
                        stroke={'red'}
                        strokeWidth={2}
                        draggable={false}
                        
                    />
                ))
            }
           

            <Rect
                x={0}
                y={0}
                width={props.width}
                height={props.height}
                onClick={event => {
                   
                    if (!isComplete) {
                        const x = event.evt.offsetX
                        const y = event.evt.offsetY
                        handleClick({ x, y })
                    }
                }}
                onMouseMove={event => {
                    if (!isComplete) {
                        const x = event.evt.offsetX
                        const y = event.evt.offsetY
                        setNextPoint({ x, y })
                    }
                    
                    const container = event.target.getStage().container();
                    container.className = (props.mode==='add')?"pen-cursor":"standard-cursor";
                }}
            />

            {points[0] && !isComplete && (
                <PolygonOriginAnchor
                    point={points[0]}
                    onValidClick={() => {
                        props.onComplete(points)


                        dispatch(areaInsert(points));
                        // setNextPoint(points[0])
                        // setIsComplete(true)
                        // back to init status
                        setPoints([]);
                        setNextPoint({ x: null, y: null });
                        setIsComplete(false);
                        props.setMode('select');

                    }}
                    onValidMouseOver={() => {
                        setNextPoint(points[0])
                    }}
                    validateMouseEvents={() => {
                        return points.length > 2
                    }}
                />
            )}
        </>
    )
});

export default areaCreate;