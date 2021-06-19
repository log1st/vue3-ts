import { isEmpty }        from 'lodash';
import { URL as baseURL } from "@/settings/config";
import Vue                from 'vue';

const renameProperty = function (obj, oldName, newName) {
    // Do nothing if the names are the same
    if (oldName === newName) {
        return obj;
    }
   // Check for the old property name to avoid a ReferenceError in strict mode.
   if (obj.hasOwnProperty(oldName)) {
       obj[newName] = obj[oldName];
       delete obj[oldName];
   }
   return obj;
};

/**
 * Обертка над axios для работы с приватным api
 * @param {*} param
 */
export const http = async ({ url = baseURL, command, method, data, formData, params, timeout = 0, requestCode }) => {
    // использовалось для обработки данных в camelCase
  
    let payload = {
        ...data,      
    };
    if (formData) {
        payload = formData
    } 
    let paramsData = {
        ...params
    }
    let getRequestCode = requestCode === 'none' ? false : true
    if (command != '') {
        url = url + command
    }
    delete axios.defaults.headers.common["X-Auth-Token"]
    
    let token = localStorage.getItem('token')
    axios.defaults.headers.common["X-Auth-Token"] = token

    const serverResponse = await axios({
        url,
        method,
        params: paramsData,
        data: payload,
        timeout
    })

    return new Promise((res, rej) => {
        if(!isEmpty(serverResponse.data) && !isEmpty(serverResponse.data.error)) {
            const errorsKey = serverResponse.data.error

                Vue.$toast.open({
                    message: `${errorsKey || 'Сервеная ошибка'}`,
                    type: 'error',
                    duration: 5000,
                    dismissible: true,
                    position: 'top-right'
                });
            
            console.error('Server response error', errorsKey);
            return rej(serverResponse);
        } else if (!isEmpty(serverResponse.data)) {
            let resp = serverResponse.data
            if (getRequestCode) {
                resp.RequestStatusCode = serverResponse.status 
            }
            return res(resp);
        } else if (isEmpty(serverResponse.data)) {
            if (serverResponse.status === 204) {
                let resp = {
                    RequestStatusCode: 204
                }
                return res(resp) 
            } else {
                rej(serverResponse)
            }
        }
    });
}


export default {
    namespaced: true,
};  