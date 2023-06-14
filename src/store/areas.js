import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import update from 'react-addons-update';
import log from "../utils/console";
import moment from 'moment';
import palette from '../utils/palette.json';





const TASK_SERVER = process.env.REACT_APP_TASK_SERVER;
const APP_URL = `${TASK_SERVER}/apps`;

const componentToHex = (c) => {
    var hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}

const rgbToHex = (r, g, b) => {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

const setPaletteArr = () => {
    let myColorList = [];
    for (var key in palette) {
        if (palette.hasOwnProperty(key)) {
            myColorList.push(rgbToHex(palette[key][2], palette[key][1], palette[key][0]));
        }
    }
    return (myColorList);
}

export const getAppSetting = createAsyncThunk('areas/getAppSetting', async (taskUid, { getState, requestId }) => {
   


    const response = await fetch(`${APP_URL}/${taskUid}`);
    return response.json();
});

const areasSlice = createSlice({
    name: "areas",
    initialState: { 
        status: 'idle', 
        drawWidth:0, 
        drawHeight:0, 
        areaNameArr: [[0, 'Area 1']], 
        
        areaShapeArr: [[]], 
       
        linePanel: false,
        lineNameArr: [['Line 1A','Line 1B']], 
        linePointArr: [[[],[]]], 
        lineRelationArr:[['','']], 

        areaDependOn: [[{ "name": "name", "checked": true, "key": 0, "color": "white" }]], 
        areaEditingIndex: 0, 
        areaMaxNumber: 1, 
        paletteArr: setPaletteArr(),
        modelData:'N/A',
        selectedApplication:'',
        selectedModel:'',
        
        deleteStatus:'idle',
        deleteMessage:'',

        addStatus:'idle',
        addMessage:'',

        updateStatus:'idle',
        updateMessage:'',
    },
    reducers: {

        initData(state, action) {
            log('init area data group')
            log(action.payload)
            const w = action.payload.w;
            const h = action.payload.h;
            const space = 8;

            state.areaNameArr = [[0, 'Area 1']];
            state.lineNameArr = [['Line 1A','Line 1B']];
            state.areaShapeArr = [[{ "x": space, "y": space }, { "x": w - space, "y": space }, { "x": w - space, "y": h - space }, { "x": space, "y": h - space }]];
            state.linePointArr = [[[],[]]];
            state.lineRelationArr = [['','']]
            state.areaEditingIndex = 0;
            state.areaMaxNumber= 1;
            state.paletteArr = setPaletteArr();
            //state.areaDependOn = [[{ "name": "name", "checked": true, "key": 0, "color": "white" }]];
        },
        setDependOn(state, action) {
          
            const myData = action.payload;
            let myDependOnData = [];
            myData.forEach((item, idx) => {
                const myItem = {};
                myItem.name = item;
                myItem.checked = true;
                myItem.key = idx;
                myItem.color = state.paletteArr[idx];
                myDependOnData.push(myItem);
            });
            const currentLength = state.areaNameArr.length;
            let myArr=[];
            for (let i = 0; i < currentLength; i++) {
                myArr.push(myDependOnData)
            }
            state.areaDependOn = myArr;
            log('myArr.length='+myArr.length)
           
        },
        toggleSelectAll(state, action) {
            log('toggle select all')
           
            let myTemp = state.areaDependOn;
            let myData = myTemp[state.areaEditingIndex];

            if (action.payload) {
                myData.forEach((item) => {
                    item.checked = true;
                });

            } else {
                myData.forEach((item) => {
                    item.checked = false;
                });
            }

            myTemp[state.areaEditingIndex] = myData;
            state.areaDependOn = myTemp;


        },
        toggleDependOnItem(state, action) {

            state.areaDependOn[state.areaEditingIndex][action.payload.key].checked = (!action.payload.checked);

        },
        areaInsert(state, action) {
            log('area create')
            log(action.payload)
            const currentLength = state.areaNameArr.length;
           
            const newName=state.areaMaxNumber;
            state.areaMaxNumber=state.areaMaxNumber+1;
  
            const sampleDependOn = state.areaDependOn[0];
           
            let newDependOnArr=[];
            sampleDependOn.forEach((item, idx) => {
                const myItem = {};
                myItem.name = item.name;
                myItem.checked = true;
                myItem.key = item.key;
                myItem.color = item.color;
                newDependOnArr.push(myItem);
            });

            state.areaDependOn.push(newDependOnArr);
            state.areaShapeArr.push(action.payload);
            state.linePointArr.push([[],[]]);
            state.lineRelationArr.push(['','']);
            state.areaNameArr.push([currentLength, `Area ${newName + 1}`]);
            state.lineNameArr.push([`Line ${newName + 1}A`,`Line ${newName + 1}B`]);

            state.areaEditingIndex = currentLength;
        },
        areaSelected(state, action) {
            state.areaEditingIndex = action.payload===null?0:action.payload;
        },
        areaRename(state, action) {
            log('area rename')
            const {name,idx}=action.payload;
            state.areaNameArr[idx][1]=name;

        },
        areaUpdate(state, action) {
            log('area update')
            state.areaShapeArr[state.areaEditingIndex]=action.payload;
        },
        areaDelete(state, action) {
            log('area delete')
            if (state.areaNameArr.length>1){
                const idx=state.areaEditingIndex;
                const areaName=state.areaNameArr[idx][1];
                state.areaNameArr.splice(idx, 1);
                state.areaShapeArr.splice(idx, 1);
                state.areaDependOn.splice(idx, 1);

                state.lineNameArr.splice(idx, 1);
                state.linePointArr.splice(idx, 1);
                state.lineRelationArr.splice(idx, 1);

                state.areaNameArr.forEach((item, idx) => {
                    state.areaNameArr[idx][0]=idx;
                });
               
                state.areaEditingIndex=0;
                state.deleteStatus='success';
                state.deleteMessage=`${areaName} has been deleted`;
            }else{
                log('left 1 area, could not delete it')
                state.deleteStatus='error';
                state.deleteMessage='Requires at least one area';
            }
           
        },
        lineADelete(state, action) {
            log('line A delete')
            state.linePointArr[state.areaEditingIndex][0]=null;
        },
        lineBDelete(state, action) {
            log('line B delete')
            state.linePointArr[state.areaEditingIndex][1]=null;
        },
        lineAUpdate(state, action) {
            log('line A update')
            log(action.payload)
            state.linePointArr[state.areaEditingIndex][0]=action.payload;
        },
        lineBUpdate(state, action) {
            log('line B update')
            log(action.payload)
            state.linePointArr[state.areaEditingIndex][1]=action.payload;
        },
        lineARelationUpdate(state, action) {
            log('line A Relation update')
            log(action.payload)
            state.lineRelationArr[state.areaEditingIndex][0]=action.payload;
        },
        lineBRelationUpdate(state, action) {
            log('line A Relation update')
            log(action.payload)
            state.lineRelationArr[state.areaEditingIndex][1]=action.payload;
        },
        lineUpdate(state,action){
            log('whole line update')
            log(action.payload)
            state.linePointArr[state.areaEditingIndex]=action.payload;
        },
        setFileWidthHeight(state,action){
            state.drawWidth=action.payload.drawWidth;
            state.drawHeight=action.payload.drawHeight;
        },
        setLinePanel(state,action){
            state.linePanel=action.payload.linePanel;
        },
        lineDataReset(state,action){

            state.linePointArr.forEach((item, idx) => {
                state.linePointArr[idx]=[[],[]];
            });

            state.lineRelationArr.forEach((item, idx) => {
                state.lineRelationArr[idx]=['',''];
            });

        },
        setModelData(state,action){
            state.modelData=action.payload;
        },
        resetStatus(state,action){
            state.status='idle';
        },
        resetDeleteStatus(state,action){
            state.deleteStatus='idle';
            state.deleteMessage='';
        },
        resetAddStatus(state,action){
            state.addStatus='idle';
            state.addMessage='';
        },
        resetUpdateStatus(state,action){
            state.updateStatus='idle';
            state.updateMessage='';
        },
        setSelectedModel(state,action){

            log('set selected model')
            log(action.payload)
            state.selectedModel=action.payload.selectedModel;
        },
        setSelectedApplication(state,action){
            state.selectedApplication=action.payload.applicationName;
        },
    },
    extraReducers: (builder) => {

    // ---- fetch data conditions ---
    builder.addCase(
        getAppSetting.fulfilled,
        (state, action) => {
          
            log('--- get app setting fulfilled ---')
           
            state.selectedApplication=action.payload.data[0].name;

            const modelType=action.payload.data[0].type

            const myIndex_1 = state.modelData.findIndex(item => item.uid === state.selectedModel);
            const myDependOn = JSON.parse(state.modelData[myIndex_1].classes.replace(/'/g, '"'));

            const myData=action.payload.data[0].app_setting.application.areas;
           
            let myAreaNameArr=[];
            let myAreaDependOn=[];
            let myAreaShapeArr=[];
            let myLineNameArr=[];
            let myLinePointArr=[];
            let myLineRelationArr=[];
           // const sampleAreaDependOn=state.areaDependOn[0];

            myData.forEach((item1, idx) => {
                
                // (1) Area Name Array
                myAreaNameArr.push([idx,item1.name]);

                // (2) Depend On Array
                let newDependOn=[];
                myDependOn.forEach(function(item2, idx2){
                    const myItem = {};
                    myItem.name = item2;
                    myItem.checked = false;
                    myItem.key = idx2;
                    myItem.color = state.paletteArr[idx2];
                    item1.depend_on.forEach((item3, idx3) => {
                        if (item2===item3){
                            myItem.checked = true;
                        }
                    });
                    newDependOn.push(myItem);
                  
                });
                myAreaDependOn.push(newDependOn);

                // (3) Area Shape Array
                const areaPoints=item1.area_point;
              
                let myAreaShape=[];
                if (areaPoints){
                    areaPoints.forEach((item3,idx)=>{
                 
                        const myPoint={};
                        myPoint.x=Math.round(item3[0]*state.drawWidth);
                        myPoint.y=Math.round(item3[1]*state.drawHeight);
                        myAreaShape.push(myPoint);
                      
                    })
                    myAreaShapeArr.push(myAreaShape);
                }
              
                // (4) Line Point Array
                const linePoints=item1.line_point;
                let linePointArr=[];
                let lineNameArr=[];
              
                if (linePoints){
                    Object.keys(linePoints).forEach(function(k){
                        //log(k + ' - ' + linePoints[k]);
                        //linePointArr.push(linePoints[k].flat());
                        const x1=Math.round(linePoints[k][0][0]*state.drawWidth);
                        const y1=Math.round(linePoints[k][0][1]*state.drawHeight);
                        const x2=Math.round(linePoints[k][1][0]*state.drawWidth);
                        const y2=Math.round(linePoints[k][1][1]*state.drawHeight);
                        linePointArr.push([x1,y1,x2,y2]);
                        lineNameArr.push(k);
                    });
                    myLinePointArr.push(linePointArr);
                }else{
                    lineNameArr.push(`Line ${idx+1}A`);
                    lineNameArr.push(`Line ${idx+1}B`);
                    myLinePointArr.push([[],[]]);
                }
                
                myLineNameArr.push(lineNameArr);

                // (5) Line Relation Array 
                const lineRelation=item1.line_relation;
                let lineRelationArr=['','']
                if (lineRelation){
                    if (lineRelation.length===2){
                        lineRelationArr=[lineRelation[0].name,lineRelation[1].name];
                    }else if (lineRelation.length===1){
                        lineRelationArr=[lineRelation[0].name,''];
                    }else{
                        lineRelationArr=['',''];
                    }
                }
                myLineRelationArr.push(lineRelationArr);


            });
      
            state.areaShapeArr=myAreaShapeArr;
            state.linePointArr=myLinePointArr;
            state.lineNameArr=myLineNameArr;
            state.lineRelationArr=myLineRelationArr;
            state.areaDependOn=myAreaDependOn;

            state.areaNameArr=myAreaNameArr;
            state.areaEditingIndex=0;

            state.status = 'complete';
        
        }
    )
    builder.addCase(
        getAppSetting.pending,
        (state, { payload }) => {
            log('--- get app setting pending ---');
            state.status = 'loading';
        }
    )
    builder.addCase(
        getAppSetting.rejected,
        (state, { payload }) => {
            log('--- get app setting reject ---');
            state.status = 'error';
        }
    )


    }
});
export const areasActions = areasSlice.actions;
export const { initData, setDependOn, toggleSelectAll, toggleDependOnItem, areaInsert, areaSelected, areaRename, areaUpdate, areaDelete, lineAUpdate, lineBUpdate,lineARelationUpdate,lineBRelationUpdate,setFileWidthHeight,lineUpdate,setLinePanel,lineDataReset,setModelData,resetStatus,resetDeleteStatus,resetAddStatus,resetUpdateStatus,setSelectedApplication,setSelectedModel,lineADelete,lineBDelete } = areasSlice.actions;
export default areasSlice.reducer;
