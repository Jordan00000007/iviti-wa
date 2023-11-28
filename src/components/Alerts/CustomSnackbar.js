
import React,{forwardRef} from 'react';
import log from "../../utils/console";

import { SnackbarContent,Button } from '@mui/material';



import { useSnackbar } from 'notistack';

import { ReactComponent as IconSuccess } from '../../assets/Feedback_Icon_Success.svg';
import { ReactComponent as IconFail } from '../../assets/Feedback_Icon_Fail.svg';
import { ReactComponent as IconLoading } from '../../assets/Feedback_Icon_Loading.svg';



// STEP 1：使用 React.forwardRef 來建立客製化的 Snackbar

const StyledSnackbarContent = forwardRef((props, ref) => {

  const { closeSnackbar } = useSnackbar();
  const { id, data } = props;
  const { type,msg } = data;

  const iconArr = [<IconSuccess />, <IconFail />, <IconLoading className='rotating-svg'/>]
  
  return (
    <div ref={ref} style={{padding:0}}>
      <SnackbarContent
       style={{background:'var(--on_color_1)',width:1200,height:44,paddingLeft:5}}
        message={
          <div className='d-flex flex-row align-items-center'>
            {iconArr[type]}
            <div style={{paddingTop:3,paddingLeft:5}}>
              {msg} 
            </div>   
          </div>
        }
       
      />
    </div>
  );
});

// STEP 2：content 是函式，它可以接收參數 data 並回傳一個函式
// 這個 data 可以定義自己需要傳入 StyledSnackbarContent 的資料
// 後面回傳的 function 則是 notistack 用來接收 key 和 message 的 callback function
export const content = (data) => (key, message) => {

  log('key-->')
  log(key)
  log('message-->')
  log(message)
  // 把取得的資料傳入 StyledSnackbarContent 中
  return <StyledSnackbarContent id={key} message={message} data={data} />;
};

export default content;