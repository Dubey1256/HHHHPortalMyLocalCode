import * as React from "react";
import { useEffect, useState } from 'react';
import { Web } from "sp-pnp-js";
import * as moment from 'moment';
export const getData = async (url:any,listId:any,query:any,filter:any) => {
    const web = new Web(url);
    let result;
    try {
        result = (await web.lists.getById(listId).items.select(query).filter(filter).get());
    }
    catch (error) {
        return Promise.reject(error);
    }

    return result;
    
}

