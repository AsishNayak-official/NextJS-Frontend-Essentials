"use client"
import { notification } from 'antd';

const getBackgroundColor = (type:string) => {
  switch (type) {
    case 'success':
      return '#C1F2B0'; // Green
    case 'warning':
      return '#FFBB64'; // Yellow
    case 'error':
      return '#f27878'; // Red
    case 'info':
      return '#8ADAB2'; // Blue
    default:
      return '#ffffff'; // Default white
  }
};


const useNotifications = () => {
  const [api, contextHolder] = notification.useNotification();

  const success = (message: string, description: string, duration?: number) => {
    api.success({
      message,
      description,
      duration,
      style: { backgroundColor:getBackgroundColor('success'), borderRadius: '10px' },
    });
  };

  const warning = (message: string, description: string, duration?: number) => {
    api.warning({
      message,
      description,
      duration,
      style: { backgroundColor:getBackgroundColor('warning'), borderRadius: '10px' },
    });
  };
  const error = (message: string, description: string, duration?: number) => {
    api.error({
      message,
      description,
      duration,
      style: { backgroundColor:getBackgroundColor('error'), borderRadius: '10px' },
    });
  };

  const info = (message: string, description: string, duration?: number) => {
    api.info({
      message,
      description,
      duration,
      style: { backgroundColor:getBackgroundColor('info'), borderRadius: '10px' },
    });
  };
  return { contextHolder, notification:{success,error,warning,info} };
};

export default useNotifications;


// import useNotifications from "@/input-components/useNotification";


// export default function Home() {
//   const {contextHolder,notification} = useNotifications();
//   const handleSuccess = () => {
//     notification.success('Success', 'This is a success notification',1.5); 
//   };

//   return (
//     <>
// {contextHolder}
// <button onClick={handleSuccess}>Show Success Notification</button>
//     </>
//   );
// }
