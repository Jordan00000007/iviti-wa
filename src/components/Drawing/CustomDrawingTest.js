import React, { useState, useEffect, useImperativeHandle, forwardRef, useRef } from "react";
import { Circle, Rect, Layer, Line, Stage, Image, Label, Text, Tag, Group, Draggable, useStrictMode } from "react-konva";
import Konva from 'konva';


import useImage from "use-image"

import log from "../../utils/console";
import LabelButton from '../../components/Buttons/LabelButton';



function Anchor(props) {
    const [strokeWidth, setStrokeWidth] = useState(4)

    return (
        <Circle
            x={props.point.x}
            y={props.point.y}
            radius={10}
            stroke="gray"
            fill={props.fill}
            strokeWidth={strokeWidth}
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
    const [fill, setFill] = useState("transparent")

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
                    setFill("#FBB03B")
                    props.onValidMouseOver()
                } else {
                    document.body.style.cursor = "not-allowed"
                    setFill("red")
                }
            }}
            onMouseOut={() => {
                setFill("transparent")
            }}
        />
    )
}

function PolygonDisplay(props) {

    // const [polygons, setPolygons] = useState([
    //     [{"x":460,"y":173},{"x":553,"y":303},{"x":429,"y":374},{"x":55,"y":301},{"x":107,"y":90},{"x":257,"y":311},{"x":303,"y":127}],
    //     [{"x":727,"y":119},{"x":776,"y":202},{"x":603,"y":218},{"x":580,"y":102}],
    // ])

    //const [polygons, setPolygons] = useState(props.polygons)

    
    const getMax = (array, propName) => {
        var max = 0;
        var maxItem = null;
        for (var i = 0; i < array.length; i++) {
            var item = array[i];
            if (item[propName] > max) {
                max = item[propName];
                maxItem = item;
            }
        }
        return maxItem;
    }

    const getMin = (array, propName) => {
        var min = 999;
        var minItem = null;
        for (var i = 0; i < array.length; i++) {
            var item = array[i];
            if (item[propName] < min) {
                min = item[propName];
                minItem = item;
            }
        }
        return minItem;
    }


    const getLabelX = (polygons) => {

        if (polygons.length > 0) {
            let newPolys = polygons;
            let maxX = getMax(newPolys, "x").x;
            let maxY = getMax(newPolys, "y").y;
            newPolys.forEach(function (item, idx) {
                const dist = Math.sqrt(Math.pow((item.x - maxX), 2) + Math.pow((item.y - maxY), 2));
                newPolys[idx].dist = dist;
            });
            let obj = getMin(newPolys, "dist");
            return obj.x;
        }
        return 0;
    }

    const getLabelY = (polygons) => {

        if (polygons.length > 0) {
            let newPolys = polygons;
            let maxX = getMax(newPolys, "x").x;
            let maxY = getMax(newPolys, "y").y;
            newPolys.forEach(function (item, idx) {
                const dist = Math.sqrt(Math.pow((item.x - maxX), 2) + Math.pow((item.y - maxY), 2));
                newPolys[idx].dist = dist;
            });
            let obj = getMin(newPolys, "dist");
            return obj.y;
        }
        return 0;
    }

    return (
        <>


            {props.polygons.map((item, idx) => (
                <Group key={`polygon_${idx}`}>
                    {
                        (idx!==props.polygonOrder) &&
                        <>
                        <Line
                            key={`line_${idx}`}
                            strokeWidth={3}
                            stroke="blue"
                            opacity={0.3}
                            lineJoin="round"
                            fill="green"
                            points={item
                                .flatMap(item => [item.x, item.y])
                                .concat([item[0].x, item[0].y])}
                            onClick={event => {
                                log('polygon click')
                                log(item)
                                props.onClick(event, props.polygons[idx], props.polygonsName[idx], idx)
                            }}
                            // onClick={props.onClick(item)}
                            closed={true}
                        />
                        <Label x={getLabelX(item) } y={getLabelY(item) } key={`label_${idx}`}>
                            <Tag
                                key={`tag_${idx}`}
                                fill={'red'}
                                opacity={0.8}
                                cornerRadius={5}
                            />
                            <Text text={props.polygonsName[idx]}
                                key={`text_${idx}`}
                                fontSize={30}
                                fontFamily="roboto"
                                fill="white"
                                padding={10}
                                height={44}
                                lineHeight={1}
                            />
                        </Label>
                        </>
                    }
                    
                </Group>
            ))}

        </>
    )

}

function PolygonEdit(props) {

    // const [polygons, setPolygons] = useState([
    //     // [{"x":460,"y":173},{"x":553,"y":303},{"x":429,"y":374},{"x":55,"y":301},{"x":107,"y":90},{"x":257,"y":311},{"x":303,"y":127}],
    //     { "x": 727, "y": 119 }, { "x": 776, "y": 202 }, { "x": 603, "y": 218 }, { "x": 580, "y": 102 },
    // ])

    const [polygons, setPolygons] = useState([])

    const [radius, setRadius] = useState(10);

    const [lineA, setLineA] = useState([]);
    const [lineB, setLineB] = useState([]);

    const [lineADrawing, setLineADrawing] = useState(false);
    const [lineBDrawing, setLineBDrawing] = useState(false);


    const [transPoly, setTransPoly] = useState([])
    const [transLineA, setTransLineA] = useState([])
    const [transLineB, setTransLineB] = useState([])
    const [nextPointA, setNextPointA] = useState({x:1,y:1})
    const [nextPointB, setNextPointB] = useState({x:1,y:1})
    //const [polygons, setPolygons] = useState(props.polygons)

    const [stopBubble, setStopBubble] = useState(false)

    const trans = (org) => {
        let ans = [];
        org.forEach(function (item) {
            ans.push(item.x);
            ans.push(item.y);
        });
        return ans
    }

    const checkDelete = (point, order) => {

        polygons.forEach(function (item, idx) {

            const dist = Math.sqrt(Math.pow((item.x - point.x), 2) + Math.pow((item.y - point.y), 2));

            if ((dist <= 10) && (order !== idx)) {
                let tmpPolys = polygons;
                tmpPolys = tmpPolys.filter(function (ele) {
                    return ele !== item;
                });
                setPolygons(tmpPolys);
                setTransPoly(trans(polygons));
            }

        });


    }

    const getMax = (array, propName) => {
        var max = 0;
        var maxItem = null;
        for (var i = 0; i < array.length; i++) {
            var item = array[i];
            if (item[propName] > max) {
                max = item[propName];
                maxItem = item;
            }
        }
        return maxItem;
    }

    const getMin = (array, propName) => {
        var min = 99999;
        var minItem = null;
        for (var i = 0; i < array.length; i++) {
            var item = array[i];
            if (item[propName] < min) {
                min = item[propName];
                minItem = item;
            }
        }
        return minItem;
    }

    const getLabelX = () => {

        if (polygons.length > 0) {
            let newPolys = polygons;
            let maxX = getMax(newPolys, "x").x;
            let maxY = getMax(newPolys, "y").y;
            newPolys.forEach(function (item, idx) {
                const dist = Math.sqrt(Math.pow((item.x - maxX), 2) + Math.pow((item.y - maxY), 2));
                newPolys[idx].dist = dist;
            });
            let obj = getMin(newPolys, "dist");
            return obj.x;
        }
        return 0;
    }

    const getLabelY = () => {

        if (polygons.length > 0) {
            let newPolys = polygons;
            let maxX = getMax(newPolys, "x").x;
            let maxY = getMax(newPolys, "y").y;
            newPolys.forEach(function (item, idx) {
                const dist = Math.sqrt(Math.pow((item.x - maxX), 2) + Math.pow((item.y - maxY), 2));
                newPolys[idx].dist = dist;
            });
            let obj = getMin(newPolys, "dist");
            return obj.y;
        }
        return 0;
    }

    const updatePosition = (x, y) => {
        let tmpPolygons = polygons;
        let minX = 0;
        let minY = 0;
        tmpPolygons.forEach(function (item, idx) {
            item.x = item.x + x;
            item.y = item.y + y;
            if (item.x < minX) minX = item.x;
            if (item.y < minY) minY = item.y;

        });
        if (minX < 0) {
            tmpPolygons.forEach(function (item, idx) {
                item.x = item.x - minX;
            });
        }
        if (minY < 0) {
            tmpPolygons.forEach(function (item, idx) {
                item.y = item.y - minY;
            });
        }
        setPolygons(tmpPolygons);
        setTransPoly(trans(tmpPolygons))

        let tmpLineA = lineA;
        tmpLineA.forEach(function (item, idx) {
            item.x = item.x + x;
            item.y = item.y + y;
            if (minX < 0) item.x = item.x - minX;
            if (minY < 0) item.y = item.y - minY;

        });
        setLineA(tmpLineA);
        setTransLineA(trans(tmpLineA));

        let tmpLineB = lineB;
        tmpLineB.forEach(function (item, idx) {
            item.x = item.x + x;
            item.y = item.y + y;
            if (minX < 0) item.x = item.x - minX;
            if (minY < 0) item.y = item.y - minY;

        });
        setLineB(tmpLineB);
        setTransLineB(trans(tmpLineB));
    }

    useEffect(() => {

        setPolygons(props.polygon);
        setTransPoly(trans(props.polygon));


    }, [props]);

    useStrictMode(true);


    return (
        <>

            {/* Edit Polygon Whole Group */}
            <Group
                draggable={!props.lineMode}
                x={0}
                y={0}
                onDragStart={event => {
                }}
                onDragMove={event => {
                }}
                onDragEnd={event => {

                    if (props.lineMode) {
                      
                    } else {
                        if (!stopBubble) {
                            log('group drag end')
                            event.evt.stopPropagation();
                            const group = event.target;
                            updatePosition(group.x(), group.y());

                        }

                    }
                    setStopBubble(false);
                }}
            >

                {/* Edit Polygon for Display */}
                <Line
                    // for display
                    strokeWidth={5}
                    stroke="#FBB03B"
                    opacity={0.3}
                    lineJoin="round"
                    fill="#FBB03B"
                    points={transPoly}
                    onMouseUp={event => {

                        log('mouse up')
                        log(props.lineMode)
                        log(lineADrawing)

                        if (props.lineMode) {

                            if (lineADrawing) {
                                
                                setLineADrawing(false);
                                const x = event.evt.offsetX;
                                const y = event.evt.offsetY;
                                setLineA(lineA.concat([{x:x,y:y}]))
                                setTransLineA(trans(lineA.concat([{x:x,y:y}])))

                            }
                            if (lineBDrawing) {
                                
                                setLineBDrawing(false);
                                const x = event.evt.offsetX;
                                const y = event.evt.offsetY;
                                setLineB(lineB.concat([{x:x,y:y}]))
                                setTransLineB(trans(lineB.concat([{x:x,y:y}])))

                            }
                        }

                    }}
                    onMouseDown={event => {

                        if (props.lineMode) {

                            if (lineA.length === 0) {
                                log('start draw line a')
                                setLineADrawing(true);
                                const x = event.evt.offsetX;
                                const y = event.evt.offsetY;
                                setNextPointA({ "x": x, "y": y });
                                setLineA([{ "x": x, "y": y }]);
                                setTransLineA(trans([{ "x": x, "y": y }]))

                            }
                            if ((lineA.length === 2) && (lineB.length === 0)) {
                                log('start draw line b')
                                setLineBDrawing(true);
                                const x = event.evt.offsetX;
                                const y = event.evt.offsetY;
                                setNextPointB({ "x": x, "y": y });
                                setLineB([{ "x": x, "y": y }]);
                                setTransLineB(trans([{ "x": x, "y": y }]))

                            }
                        }

                    }}
                    onMouseMove={event => {

                        if (props.lineMode) {
                            if (lineADrawing===true) {
                                const x = event.evt.offsetX;
                                const y = event.evt.offsetY;
                                setNextPointA({ x, y })  
                            }
                            if (lineBDrawing===true) {
                                const x = event.evt.offsetX;
                                const y = event.evt.offsetY;
                                setNextPointB({ x, y })  
                            }
                        }

                    }}
                    closed={true}
                    tag={{ id: 1, name: 'hexagon' }}

                  
                    onDragStart={event => {
                        if (lineA === []) {
                            log('start draw line')
                        }

                    }}
                    onDragEnd={event => {
                    }}


                >
                </Line>

                {/* Edit Polygon Label */}
                <Label x={getLabelX() + 15} y={getLabelY() - 40}>
                    <Tag
                        fill={'red'}
                        opacity={0.8}
                        cornerRadius={5}
                    />
                    <Text text={props.polygonName}
                        fontSize={30}
                        fontFamily="roboto"
                        fill="white"
                        padding={10}
                        height={44}
                        lineHeight={1}
                    />
                </Label>

                {/* Edit Polygon for Add Node */}
                {polygons.map((item, idx) => (
                    <Line
                        // for detect
                        key={idx}
                        strokeWidth={5}
                        stroke="#FBB03B"
                        dashEnabled={true}
                        dash={[10, 5, 0.001, 5]}
                        opacity={1}
                        lineJoin="round"
                        order={idx}
                        fill="green"
                        points={polygons
                            .flatMap(polygons => [polygons.x, polygons.y])
                            .concat([polygons[0].x, polygons[0].y])
                            .slice(idx * 2, (idx * 2) + 4)
                        }
                        onClick={event => {

                            const order = parseInt(event.target.attrs.order);
                            log('x')
                            log(event.target.getStage().getPointerPosition().x)
                            log('y')
                            log(event.target.getStage().getPointerPosition().y)
                            let newPolys = polygons;
                            newPolys.splice(order + 1, 0, { "x": event.target.getStage().getPointerPosition().x, "y": event.target.getStage().getPointerPosition().y });
                            log(newPolys)
                            setPolygons(newPolys);
                            setTransPoly(trans(polygons));

                        }}
                        closed={false}

                    />

                ))}

                {/* Edit Polygon Node */}
                {polygons.map((item, idx) => (
                    <Circle
                        key={idx}
                        x={item.x}
                        y={item.y}
                        order={idx}
                        radius={radius}
                        fill={'#FBB03B'}
                        stroke={'gray'}
                        strokeWidth={4}
                        draggable={true}
                        onMouseOver={event => {
                            //setRadius(15)
                            log('mouse over')
                            //event.target.attrs.radius = 15;
                            //log(event.target.attrs)
                        }}
                        onMouseLeave={event => {
                            //setRadius(10)
                            log('mouse leave')
                            //event.target.attrs.radius = 10;
                        }}
                        onDragMove={event => {

                            let tmp = polygons;
                            tmp[idx].x = event.target.attrs.x;
                            tmp[idx].y = event.target.attrs.y;
                            if (tmp[idx].x < 0) tmp[idx].x = 0;
                            if (tmp[idx].y < 0) tmp[idx].y = 0;
                            setPolygons(tmp);
                            setTransPoly(trans(polygons));


                        }}
                        onDragEnd={event => {

                            log('circle drag end')
                            const order = parseInt(event.target.attrs.order);
                            checkDelete({ "x": event.target.attrs.x, "y": event.target.attrs.y }, order);
                            setStopBubble(true);
                        }}
                    />
                ))}

                {/* Line A*/}
                <Line
                    strokeWidth={5}
                    stroke="#FBB03B"
                    opacity={1}
                    lineJoin="round"
                    dashEnabled={true}
                    dash={[10, 5, 0.001, 5]}
                    Draggable={props.lineMode}
                    points={(lineADrawing)?transLineA.concat([nextPointA.x,nextPointA.y]):transLineA}
                    onClick={event => {
                    }}
                    onDragMove={event=>{
                        setStopBubble(true);
                        log('line A moving...')
                        log(event)
                        
                    }}
                    closed={false}
                />



                {/* Line A Node*/}
                {lineA.map((item, idx) => (
                    <Circle
                        key={idx}
                        x={item.x}
                        y={item.y}
                        order={idx}
                        radius={radius}
                        fill={'#FBB03B'}
                        stroke={'gray'}
                        strokeWidth={4}
                        draggable={props.lineMode}
                        onMouseOver={event => {

                        }}
                        onMouseLeave={event => {

                        }}
                        onDragMove={event => {

                            const order = parseInt(event.target.attrs.order);
                            let tmp = lineA;
                            const x = event.evt.offsetX;
                            const y = event.evt.offsetY;
                            tmp[order].x = x;
                            tmp[order].y = y;
                            setLineA(tmp);
                            setTransLineA(trans(tmp));
                            if (order===1){
                                setNextPointA({x:x,y:y})
                            }

                        }}
                        onDragEnd={event => {

                        }}
                    />
                ))}

                {/* Line A Label */}
                {
                    (lineA.length === 2) &&

                    <Label x={lineA[1].x + 15} y={lineA[1].y - 40}>
                        <Tag
                            fill={'blue'}
                            opacity={0.8}
                            cornerRadius={5}
                        />
                        <Text text="Line A"
                            fontSize={30}
                            fontFamily="roboto"
                            fill="white"
                            padding={10}
                            height={44}
                            lineHeight={1}
                        />
                    </Label>
                }


                {/* Line B*/}
                <Line
                    strokeWidth={5}
                    stroke="#FBB03B"
                    opacity={1}
                    lineJoin="round"
                    dashEnabled={true}
                    dash={[10, 5, 0.001, 5]}
                    //points={transLineB.concat([nextPointB.x,nextPointB.y])}
                    points={(lineBDrawing)?transLineB.concat([nextPointB.x,nextPointB.y]):transLineB}
                    onClick={event => {
                    }}
                    closed={false}
                />

                {/* Line B Node*/}
                {lineB.map((item, idx) => (
                    <Circle
                        key={idx}
                        x={item.x}
                        y={item.y}
                        order={idx}
                        radius={radius}
                        fill={'#FBB03B'}
                        stroke={'gray'}
                        strokeWidth={4}
                        draggable={props.lineMode}
                        onMouseOver={event => {

                        }}
                        onMouseLeave={event => {

                        }}
                        onDragMove={event => {

                            const order = parseInt(event.target.attrs.order);
                            let tmp = lineB;
                            const x = event.evt.offsetX;
                            const y = event.evt.offsetY;
                            tmp[order].x = x;
                            tmp[order].y = y;
                            setLineB(tmp);
                            setTransLineB(trans(tmp));
                            if (order===1){
                                setNextPointB({x:x,y:y})
                            }

                        }}
                        onDragEnd={event => {

                        }}
                    />
                ))}

                {/* Line B Label */}
                {
                    (lineB.length === 2) &&

                    <Label x={lineB[1].x + 15} y={lineB[1].y - 40}>
                        <Tag
                            fill={'blue'}
                            opacity={0.8}
                            cornerRadius={5}
                        />
                        <Text text="Line B"
                            fontSize={30}
                            fontFamily="roboto"
                            fill="white"
                            padding={10}
                            height={44}
                            lineHeight={1}
                        />
                    </Label>
                }

            </Group>

        </>
    )

}

const PolygonConstructor = forwardRef((props, ref) => {
    const [points, setPoints] = useState([])
    const [nextPoint, setNextPoint] = useState({ x: 0, y: 0 })
    const [isComplete, setIsComplete] = useState(false)

    const handleClick = ({ x, y }) => {
        setPoints(points.concat({ x, y }))
    }

    useImperativeHandle(ref, () => ({
        setReset: () => {
            setPoints([]);
            setNextPoint({ x: 0, y: 0 });
            setIsComplete(false);
        }
    }));

    return (
        <>
            <Line
                strokeWidth={5}
                stroke="#FBB03B"
                opacity={1}
                dashEnabled={true}
                dash={[10, 5, 0.001, 5]}
                lineJoin="round"
                closed={isComplete}
                points={points
                    .flatMap(point => [point.x, point.y])
                    .concat([nextPoint.x, nextPoint.y])}
            />

            <Rect
                x={0}
                y={0}
                width={window.innerWidth}
                height={558}
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
                }}
            />

            {points[0] && !isComplete && (
                <PolygonOriginAnchor
                    point={points[0]}
                    onValidClick={() => {
                        props.onComplete(points)
                        // setNextPoint(points[0])
                        // setIsComplete(true)
                        // back to init status
                        setPoints([]);
                        setNextPoint({ x: 0, y: 0 });
                        setIsComplete(false);

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

export default function App() {
    const [points, setPoints] = useState([])
    const [image] = useImage("/E3.png");
    const [polygons, setPolygons] = useState([])
    const [polygonsName, setPolygonsName] = useState([])
    const [editMode, setEditMode] = useState(false);
    const [lineMode, setLineMode] = useState(false);
    const [addMode, setAddMode] = useState(false);
    const [displayMode, setDisplayMode] = useState(true);
    const [editPolygon, setEditPolygon] = useState([]);
    const [editPolygonName, setEditPolygonName] = useState('')
    const [editPolygonOrder, setEditPolygonOrder] = useState(-1)

    const polygonConstructorRef = React.useRef(null);

    const handleAddButton = () => {
       
        setAddMode(true);
        setEditMode(false);
        setEditPolygonOrder(-1);
        //setPoints([]);
        //polygonConstructorRef.current.setReset();
    }

    const handleDisplayButton = (event, item) => {
        setAddMode(false);
        setEditMode(false);
        setEditPolygonOrder(-1);
        setDisplayMode(true);
    }

    const handleClearButton = () => {
        log('handle clear button');
        setEditMode(false);
        setPolygons([]);
        //polygonConstructorRef.current.setReset();
    }

    const handleEditPolygon = (event, item ,name, order) => {
        log('hanlde edit polygon')
        log(item);
        log(name);
        log(order);
        setEditPolygon(item);
        setEditPolygonName(name);
        setEditPolygonOrder(order);
        setEditMode(true);
    }

   

    const handleLineModeButton = (event, item) => {
        log('set draw line toggle');

        if (lineMode) {
            setLineMode(false)
        } else {
            setLineMode(true)
        }

    }

    const indexToAlphabet=(index)=> {
        const alphabetStart = 'A'.charCodeAt(0); // ASCII code of 'A'
        const alphabetSize = 26; // Total number of characters in the alphabet
        if (index < 0 || index >= alphabetSize) {
          throw new Error('Index out of range');
        }
        const charCode = alphabetStart + index;
        return String.fromCharCode(charCode);
      }

    return (
        <>
            <Stage
                height={558}
                //width={860}
                width={window.innerWidth}
                style={{ border: "1px solid black",background:'white' }}
            >
                <Layer>
                    <Image image={image} />
                   
                    {
                        displayMode &&
                        <PolygonDisplay polygons={polygons} polygonsName={polygonsName} onClick={handleEditPolygon} polygonOrder={editPolygonOrder} editMode={editMode}/>
                    }

                    {
                        (addMode) &&
                        <PolygonConstructor ref={polygonConstructorRef}
                            onComplete={points => {
                                setPoints(points);
                                let tmpPoly = polygons;
                                const idx=polygons.length;
                                tmpPoly.push(points)
                                setPolygons(tmpPoly);
                                let tmpPolyName = polygonsName;
                                tmpPolyName.push(`Area ${indexToAlphabet(idx)}`)
                                setPolygonsName(tmpPolyName);
                                //log(indexToAlphabet(idx))
                              
                                 
                            }}
                        />
                    }

                    {
                        editMode &&
                        <PolygonEdit polygon={editPolygon} lineMode={lineMode} polygonName={editPolygonName} />
                    }

                </Layer>
            </Stage>
            <code>{JSON.stringify(points)}</code>

            <div className="row">
                <div className="col-12 d-flex justify-content-between" style={{ width: 500 }}>
                    <LabelButton name='add' className="my-button-submit" width="100" height="35" onClick={handleAddButton} />
                    <LabelButton name='clear' className="my-button-submit" width="100" height="35" onClick={handleClearButton} />
                    <LabelButton name='line' className="my-button-submit" width="100" height="35" onClick={handleLineModeButton} />
                    <LabelButton name='display' className="my-button-submit" width="100" height="35" onClick={handleDisplayButton} />
                </div>
            </div>

        </>
    )
}
