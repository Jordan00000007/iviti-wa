import log from "../../utils/console";
import React, { useState, useEffect, useImperativeHandle, forwardRef, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Circle, Rect, Layer, Line, Stage, Image, Label, Text, Tag, Group, Draggable, useStrictMode } from "react-konva";
import Konva from 'konva';
import useImage from "use-image"
import { areaSelected } from "../../store/areas";
import LabelButton from '../../components/Buttons/LabelButton';
import { getSourceWidthHeight, setSourceId, setDrawWidthHeight } from "../../store/sources";


const CustomDisplay = (props) => {

    const dispatch = useDispatch();
    const applicationStatus = useSelector((state) => state.applications.status);
    const applicationAreas = useSelector((state) => state.applications.areas);


    const sizeStatus = useSelector((state) => state.sources.sizeStatus);
    const originWidth = useSelector((state) => state.sources.originWidth);
    const originHeight = useSelector((state) => state.sources.originHeight);
    const drawWidth = useSelector((state) => state.sources.drawWidth);
    const drawHeight = useSelector((state) => state.sources.drawHeight);
    const sourceUid = useSelector((state) => state.sources.uid);

    // const drawWidth = 804;
    // const drawHeight = 558;

    log('-------- draw width and height ------')
    log(drawWidth)
    log(drawHeight)

    const [areaNameArr, setAreaNameArr] = useState([])
    const [areaPointArr, setAreaPointArr] = useState([])
    const [lineNameArr, setLineNameArr] = useState([[,]])
    const [linePointArr, setLinePointArr] = useState([[[], []]])

    const [mouseOverOrder, setMouseOverOrder] = useState(-1);
    const [showAreas, setShowAreas] = useState(false);


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

    const transPoly = (polygons) => {
        let myPoly = []

        for (let i = 0; i < polygons.length; i = i + 2) {
            let point = {}
            point.x = polygons[i];
            point.y = polygons[i + 1];
            myPoly.push(point)
        }

        return myPoly;

    }

    const getLabelX = (poly, myText) => {

        const polygons = transPoly(poly);

        if (polygons.length > 0) {
            let maxX = getMax(polygons, "x").x;
            let maxY = getMax(polygons, "y").y;
            let dist = [];
            polygons.forEach(function (item, idx) {
                let obj = {}
                obj.id = idx;
                obj.dist = Math.sqrt(Math.pow((item.x - maxX), 2) + Math.pow((item.y - maxY), 2));
                dist.push(obj);
                //t[idx].dist = dist;
            });
            let obj = getMin(dist, "dist");

            const myOffset = Math.round(6.66 * myText.length) + 33;
            return polygons[obj.id].x - myOffset;

        }

        return 0;
    }

    const getLabelY = (poly) => {

        const polygons = transPoly(poly);

        if (polygons.length > 0) {
            let maxX = getMax(polygons, "x").x;
            let maxY = getMax(polygons, "y").y;
            let dist = [];
            polygons.forEach(function (item, idx) {
                let obj = {}
                obj.id = idx;
                obj.dist = Math.sqrt(Math.pow((item.x - maxX), 2) + Math.pow((item.y - maxY), 2));
                dist.push(obj);
                //t[idx].dist = dist;
            });
            let obj = getMin(dist, "dist");
            return polygons[obj.id].y;
        }

        return 10;
    }

    //dispatch(getSourceWidthHeight());
    useEffect(() => {
        //log('uuid='+props.uuid)
        if (props.uuid !== undefined) {
            dispatch(setSourceId(props.uuid))
        }
    }, [props]);

    useEffect(() => {
        //log('sourceUid='+sourceUid)
        if (sourceUid !== '') {
            dispatch(getSourceWidthHeight());
        }
    }, [sourceUid]);

    useEffect(() => {
        if (sizeStatus === 'success') {

            dispatch(setDrawWidthHeight({ "maxWidth": 839, "maxHeight": 604 }));
        }
    }, [sizeStatus]);


    useEffect(() => {

        //log('applicationStatus='+applicationStatus)
        if ((applicationStatus === 'success') && (drawWidth > 0) && (drawHeight > 0)) {

            let myAreaNameArr = [];
            let myAreaPointArr = [];
            let myLineNameArr = [];
            let myLinePointArr = [];
            applicationAreas.forEach(function (item, idx) {

                log(item)

                //-----------------------------------------
                myAreaNameArr.push(item.name);
                let tmpAreaArr = [];
                //-----------------------------------------
                if (item.area_point) {
                    item.area_point.forEach(function (item2, idx2) {
                        tmpAreaArr.push(Math.round(item2[0] * drawWidth))
                        tmpAreaArr.push(Math.round(item2[1] * drawHeight))
                    });
                    myAreaPointArr.push(tmpAreaArr);
                }
              
               
                //-----------------------------------------
                let tmpLineNameArr = [];
                if (item.line_relation) {
                    tmpLineNameArr.push(item.line_relation[0].start, item.line_relation[0].end)
                }

                myLineNameArr.push(tmpLineNameArr);
                //-----------------------------------------
                let tmpLinePointArr = [];
                if (item.line_point) {
                    for (let key in item.line_point) {
                        //log(key+": "+item.line_point[key]);
                        let tmpArr = [];
                        tmpArr.push(Math.round(item.line_point[key][0][0] * drawWidth));
                        tmpArr.push(Math.round(item.line_point[key][0][1] * drawHeight));
                        tmpArr.push(Math.round(item.line_point[key][1][0] * drawWidth));
                        tmpArr.push(Math.round(item.line_point[key][1][1] * drawHeight));
                        tmpLinePointArr.push(tmpArr);
                    }
                    myLinePointArr.push(tmpLinePointArr);
                }


            });
            setAreaNameArr(myAreaNameArr);
            setAreaPointArr(myAreaPointArr);
            setLineNameArr(myLineNameArr);
            setLinePointArr(myLinePointArr);
           
        }

    }, [applicationStatus, drawWidth, drawHeight]);

    return (
        <div className="position-absolute top-50 start-50 translate-middle" style={{ zIndex: 5 }}>
            <Stage
                height={drawHeight}
                width={drawWidth}
                onMouseOver={event => {
                    setShowAreas(true);
                }}
                onMouseOut={event => {
                    setShowAreas(false);
                }}
                onClick={props.onClick}

            >
                {

                    (showAreas && (props.playing)) &&
                    <Layer>

                        {areaPointArr.map((item, idx) => (
                            <Group key={`polygon_${idx}`}>
                                <Line
                                    key={`area_${idx}`}
                                    strokeWidth={0}
                                    stroke="red"
                                    opacity={0.16}
                                    lineJoin="round"
                                    fill="#FBB03B"
                                    points={item}
                                    onClick={event => {
                                        //
                                        // if (props.mode==='select') handleAreaSelected(idx)
                                        //props.onClick(event, props.polygons[idx], props.polygonsName[idx], idx);
                                    }}
                                    //onClick={handleAreaSelected(idx)}
                                    onMouseOver={event => {

                                        setMouseOverOrder(idx);

                                    }}
                                    onMouseOut={event => {

                                        setMouseOverOrder(-1);
                                    }}
                                    closed={true}
                                />
                                <Line
                                    key={`line_${idx}`}
                                    strokeWidth={(mouseOverOrder === idx) ? 2.5 : 0}
                                    stroke="red"
                                    opacity={1}
                                    lineJoin="round"

                                    points={item.concat([item[0], item[1]])}
                                    closed={false}
                                />
                                
                                {
                                    (areaPointArr.length > 0) &&
                                    <Label x={getLabelX(item, areaNameArr[idx])} y={getLabelY(item) - 32} key={`label_${idx}`} >
                                        <Tag
                                            key={`tag_${idx}`}
                                            fill={(mouseOverOrder === idx) ? 'white' : 'red'}
                                            opacity={(mouseOverOrder === idx) ? 1 : 0.5}
                                            cornerRadius={10}
                                            stroke='red'
                                            strokeWidth={2}
                                        />
                                        <Text text={'  ' + areaNameArr[idx] + '  '}
                                            key={`text_${idx}`}
                                            fontSize={14}
                                            fontFamily="roboto"
                                            fill={(mouseOverOrder === idx) ? 'red' : 'white'}
                                            padding={6}
                                            height={24}
                                            lineHeight={1}

                                        />
                                    </Label>
                                }
                                {
                                    (linePointArr.length > 0) &&
                                    <Line
                                        strokeWidth={3}
                                        stroke="blue"
                                        opacity={1}
                                        lineJoin="round"
                                        points={linePointArr[idx][0]}
                                        //points={[50,50,100,100]}
                                        onClick={event => {
                                        }}
                                        onDragMove={event => {
                                        }}
                                        closed={false}
                                    />
                                }
                                {
                                    (linePointArr.length > 0) &&
                                    <Label x={linePointArr[idx][0][2] + 5} y={linePointArr[idx][0][3] + 5}>
                                        <Tag
                                            fill={'blue'}
                                            opacity={0.5}
                                            cornerRadius={10}
                                            stroke={"blue"}
                                            strokeWidth={2}
                                        />
                                        <Text text={`  ${lineNameArr[idx][0]}  `}
                                            fontSize={14}
                                            fontFamily="roboto"
                                            fill={'white'}
                                            padding={6}
                                            height={24}
                                            lineHeight={1}
                                        />
                                    </Label>
                                }
                                {
                                    (linePointArr.length > 0) &&
                                    <Line
                                        strokeWidth={3}
                                        stroke="blue"
                                        opacity={1}
                                        lineJoin="round"
                                        points={linePointArr[idx][1]}
                                        //points={[50,50,100,100]}
                                        onClick={event => {
                                        }}
                                        onDragMove={event => {
                                        }}
                                        closed={false}
                                    />
                                }

                                {
                                    (linePointArr.length > 0) &&
                                    <Label x={linePointArr[idx][1][2] + 5} y={linePointArr[idx][1][3] + 5}>
                                        <Tag
                                            fill={'blue'}
                                            opacity={0.5}
                                            cornerRadius={10}
                                            stroke={"blue"}
                                            strokeWidth={2}
                                        />
                                        <Text text={`  ${lineNameArr[idx][1]}  `}
                                            fontSize={14}
                                            fontFamily="roboto"
                                            fill={'white'}
                                            padding={6}
                                            height={24}
                                            lineHeight={1}
                                        />
                                    </Label>
                                }

                            </Group>
                        ))}
                    </Layer>
                }
            </Stage>
        </div>
    );

}

export default CustomDisplay;