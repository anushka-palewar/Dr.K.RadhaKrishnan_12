import { getHello } from "../api/helloApi";

export const fetchHelloMessage = async () => {
  const res = await getHello();

 
  return {
    text: res.data.message.toUpperCase(),  
    length: res.data.message.length
  };
};
