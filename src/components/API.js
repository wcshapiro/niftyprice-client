import React from "react";
import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"
import swagger_file from "../static/api/api-spec.yaml"
function API(){
    return(<>
    <>https://square.link/u/xxzAhktw</>
    <SwaggerUI url={swagger_file} /></>)
}
export default API