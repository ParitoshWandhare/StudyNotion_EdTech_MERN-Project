import React from 'react'
import {toast} from 'react-hot-toast'
import { catalogData } from '../apis'
import { apiConnector } from '../apiconnector'


export const getCatalogPageData = async(categoryId) => {
    const toastId = toast.loading("Loading...")
    let result = []
  try{
    const response = await apiConnector("POST", catalogData.CATALOGPAGEDATA_API,
        {categoryId: categoryId}
    )

    if(!response?.data?.success){
        throw new Error("Could not fetch category page data")
    }
    result = response?.data
  }
  catch(error){
    console.log("CATALOG page data API error..", error)
    toast.error(error.message)
    result = error.response?.sata
  }
  toast.dismiss(toastId)
  return result
}


