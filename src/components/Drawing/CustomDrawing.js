import React, { useState, useEffect, useImperativeHandle, forwardRef, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Circle, Rect, Layer, Line, Stage, Image, Label, Text, Tag, Group, Draggable, useStrictMode } from "react-konva";

import useImage from "use-image";

import log from "../../utils/console";
import AreaDisplay from '../../components/Drawing/AreaDisplay';
import AreaCreate from '../../components/Drawing/AreaCreate';
import AreaEdit from '../../components/Drawing/AreaEdit';

export default function App(props) {
    const [points, setPoints] = useState([])
    //const [image] = useImage('https://konvajs.github.io/assets/yoda.jpg');
    const [image] = useImage(props.src);
    const [polygons, setPolygons] = useState([])
    const [polygonsName, setPolygonsName] = useState([])
    const [editMode, setEditMode] = useState(false);
    const [lineMode, setLineMode] = useState(false);
    const [addMode, setAddMode] = useState(false);
    const [displayMode, setDisplayMode] = useState(true);
    const [editPolygon, setEditPolygon] = useState([]);
    const [editPolygonName, setEditPolygonName] = useState('')
    const [editPolygonOrder, setEditPolygonOrder] = useState(1)


    const areaNameArr = useSelector((state) => state.areas.areaNameArr);
    const areaShapeArr = useSelector((state) => state.areas.areaShapeArr);
    const areaEditingIndex = useSelector((state) => state.areas.areaEditingIndex);
    const areaDependOn = useSelector((state) => state.areas.areaDependOn);


    const polygonConstructorRef = React.useRef(null);

    const handleAddButton = () => {
       
        setAddMode(true);
        setEditMode(false);
        setEditPolygonOrder(-1);
        //setPoints([]);
        //polygonConstructorRef.current.setReset();
        log(props.src)
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
      
        setEditPolygon(item);
        setEditPolygonName(name);
        setEditPolygonOrder(order);
        
    }

    const handleLineModeButton = (event, item) => {
        log('set draw line toggle');

        if (lineMode) {
            setLineMode(false)
        } else {
            setLineMode(true)
        }

    }

    const handleChangeMode=(myMode)=>{
        log('change mode')
        log(myMode)
        props.setMode(myMode);
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


    const handleDrawLineComplete=()=>{
        log('handle draw line complete');
        props.onDrawLineComplete();
    }

    useEffect(() => {

        if (props.mode==='select'){
            handleDisplayButton();
            setLineMode(false);
        }
        if (props.mode==='add'){
            handleAddButton();
            setLineMode(false);
        }
        if (props.mode==='delete'){
            handleClearButton();
            setLineMode(false);
        }
        if (props.mode==='edit'){
            //handleClearButton();
            setEditMode(true);
            setLineMode(false);
        }
        if (props.mode==='line'){
            //handleClearButton();
            setEditMode(true);
            setLineMode(true);
        }

    }, [props]);


    useEffect(() => {
        log('--- data change ---')
        // log(areaNameArr)
        // log(areaShapeArr)
        // log(areaDependOn)
    }, [areaNameArr,areaShapeArr,areaDependOn]);

   

    return (
        <div style={{width:804,height:558,background:'var(--stream_empty)'}}  className="d-flex align-items-center justify-content-center">
            <Stage
                height={props.height}
                width={props.width}
                className={(props.mode!=='select')?"custom-cursor":"arrow"}
               
            >
                <Layer>
                    <Image image={image} />
                   
                    
                        
                    <AreaDisplay areaShapeArr={areaShapeArr} areaEditingIndex={areaEditingIndex} editMode={editMode} mode={props.mode} showAppSetting={props.showAppSetting}/>
                    

                    {
                        (addMode) &&
                        <AreaCreate ref={polygonConstructorRef} width={props.width} height={props.height}
                            onComplete={points => {
                                // setPoints(points);
                                // let tmpPoly = polygons;
                                // const idx=polygons.length;
                                // tmpPoly.push(points)
                                // setPolygons(tmpPoly);
                                // log('new data')
                                // log(points)
                                // let tmpPolyName = polygonsName;
                                // //tmpPolyName.push(`Area ${indexToAlphabet(idx)}`)
                                // tmpPolyName.push(`Area ${idx+1}`)
                                // setPolygonsName(tmpPolyName);
                                //log(indexToAlphabet(idx))
                            }}
                            setMode={handleChangeMode}
                        />
                    }

                    {
                        ((props.mode==='edit')||(props.mode==='line')) &&
                        <AreaEdit polygon={editPolygon} mode={props.mode} lineMode={lineMode} polygonName={editPolygonName} width={props.width} height={props.height} onComplete={handleDrawLineComplete}/>
                    }

                </Layer>
            </Stage>
          

        </div>
    )
}
