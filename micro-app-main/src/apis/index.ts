import axios from "axios";

const instance = axios.create({
  baseURL: "http://dev-api.jt-gmall.com",
});

instance.interceptors.response.use(reply => reply.data);
import data from './data.js'
/**
 * 快速登录
 */
export const loginQuickly = () => {
  const promise = new Promise((resolve, reject) => {
    const res = data
    resolve(res)
  })
  return promise
};
