import log from "../../utils/console";
import React, { useState, useEffect, useImperativeHandle, forwardRef, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Circle, Rect, Layer, Line, Stage, Image, Label, Text, Tag, Group, Draggable, useStrictMode } from "react-konva";
import Konva from 'konva';
import useImage from "use-image"
import { areaSelected } from "../../store/areas";
import LabelButton from '../../components/Buttons/LabelButton';
import { getSourceWidthHeight, setSourceId, setDrawWidthHeight } from "../../store/sources";


const EventAreaDisplay = (props) => {

    const dispatch = useDispatch();
    const applicationStatus = useSelector((state) => state.applications.status);
    const applicationAreas = useSelector((state) => state.applications.areas);


   
    const originWidth = useSelector((state) => state.sources.originWidth);
    const originHeight = useSelector((state) => state.sources.originHeight);

    const maxWidth = 648;
    const maxHeight = 400;
   
   
    const [areaNameArr, setAreaNameArr] = useState([])
    const [areaPointArr, setAreaPointArr] = useState([])
    const [lineNameArr, setLineNameArr] = useState([[,]])
    const [linePointArr, setLinePointArr] = useState([[[], []]])

    const [mouseOverOrder, setMouseOverOrder] = useState(-1);
    const [showAreas, setShowAreas] = useState(false);

    const [areaData, setAreaData] = useState([0,0]);

    const [drawWidth, setDrawWidth] = useState(648);
    const [drawHeight, setDrawHeight] = useState(400);


    const calculateDrawHeightWidth=()=>{
        
        let drawWidth = Math.trunc((parseInt(originWidth) / parseInt(originHeight)) * parseInt(maxHeight));
        let drawHeight = Math.trunc((parseInt(originHeight) / parseInt(originWidth)) * parseInt(maxWidth));
        if (drawWidth <= parseInt(maxWidth)) {
            drawHeight = parseInt(maxHeight);
        } else {
            if (drawHeight <= parseInt(maxHeight)) {
                drawWidth = parseInt(maxWidth);
            }
        }
        
        setDrawHeight(drawHeight);
        setDrawWidth(drawWidth);

        // log('org height')
        // log(originHeight)
        // log('org width')
        // log(originWidth)
        // log('maxWidth')
        // log(maxWidth)
        // log('maxHeight')
        // log(maxHeight)

        // log('drawHeight')
        // log(drawHeight)
        // log('drawWidth')
        // log(drawWidth)

    }

    
    useEffect(() => {
  
        //calculateDrawHeightWidth();
        let drawWidth = Math.trunc((parseInt(originWidth) / parseInt(originHeight)) * parseInt(maxHeight));
        let drawHeight = Math.trunc((parseInt(originHeight) / parseInt(originWidth)) * parseInt(maxWidth));
        if (drawWidth <= parseInt(maxWidth)) {
            drawHeight = parseInt(maxHeight);
        } else {
            if (drawHeight <= parseInt(maxHeight)) {
                drawWidth = parseInt(maxWidth);
            }
        }
        setDrawHeight(drawHeight);
        setDrawWidth(drawWidth);
        
        let tmpAreaArr = [];
        //-----------------------------------------
        if (props.area) {
            props.area.forEach(function (item) {
                tmpAreaArr.push(Math.round(item[0] * drawWidth))
                tmpAreaArr.push(Math.round(item[1] * drawHeight))

                // tmpAreaArr.push(Math.round(item[0] / originWidth * drawWidth))
                // tmpAreaArr.push(Math.round(item[1] / originHeight * drawHeight))
            });
          
            setAreaData(tmpAreaArr);
        }

    }, [props.area]);

 
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
               
                <Layer>
                    <Group>
                        <Line
                            key={`area`}
                            strokeWidth={0}
                            stroke="red"
                            opacity={0.16}
                            lineJoin="round"
                            fill="#FBB03B"
                            points={areaData}
                            
                            onMouseOver={event => {

                                //setMouseOverOrder(idx);

                            }}
                            onMouseOut={event => {

                                //setMouseOverOrder(-1);
                            }}
                            closed={true}
                        />
                        <Line
                            key={`line`}
                            strokeWidth={2.5}
                            stroke="red"
                            opacity={1}
                            lineJoin="round"
                            points={areaData.concat([areaData[0], areaData[1]])}
                            closed={false}
                        />
                    </Group>
                
                </Layer>
            
            </Stage>
        </div>
    );

}

export default EventAreaDisplay;