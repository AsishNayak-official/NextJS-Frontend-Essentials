import { store } from "@/app/redux/store";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { userLoginRefresh } from "./user";
import { updateAuthTokens, updateReload } from "@/app/redux/actions/authSlice";

axios.defaults.baseURL = process?.env?.NEXT_PUBLIC_BASE_URL ?? "";
// axios.defaults.baseURL = "https://xceedhire.stovl.co.in/";
axios.defaults.headers.post["Content-Type"] = "application/json";

//add more things
//interceptors to send authorization
axios.interceptors.request.use(function (config) {
  const AUTH_TOKEN = store.getState().auth.accessToken;
  // const AUTH_TOKEN = process?.env?.NEXT_PUBLIC_ACCESS_TOKEN;
  const REFRESH_TOKEN = store.getState().auth.refreshToken;
  // const REFRESH_TOKEN = process?.env?.NEXT_PUBLIC_ACCESS_TOKEN;
  const decodedAccessToken = jwtDecode(AUTH_TOKEN ?? '');
  const decodedRefreshToken = jwtDecode(REFRESH_TOKEN ?? '');
  if (Date.now() > (decodedAccessToken?.exp ?? 0)) {
    //Access token expired;
    if (Date.now() > (decodedRefreshToken?.exp ?? 0)) {
      //Refresh Token is also expired
      store.dispatch((updateReload({ isReload: true })))
    } else {
      //Todo change this later as the access token has been expired if there is auth in backend then it will throw error
      userLoginRefresh(REFRESH_TOKEN as string)
        .then(res => {
          console.log({ res: res.data.data })
          if (res.data.success) {
            store.dispatch(
              updateAuthTokens({
                accessToken: res.data.data.accessToken,
                refreshToken: res.data.data.refreshToken,
              }))
          } else {
            store.dispatch(updateReload({ isReload: true }))
          }
        }).catch(() => {
          store.dispatch(updateReload({ isReload: true }))
        })
    }
  }

  config.headers.Authorization = AUTH_TOKEN ? AUTH_TOKEN : "";
  return config;
});

axios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    throw error;
  }
);

export default axios;
