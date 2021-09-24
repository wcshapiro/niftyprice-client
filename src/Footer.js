import React, { useEffect, useState } from 'react';
import "./Footer.css"
import { Button } from '@material-ui/core';

function useForceUpdate(){
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => value + 1); // update the state to force render
}
function Footer() {
    const forceUpdate = useForceUpdate();
    return (
        <div class="footer" >
            <hr></hr>
            <div>
            <div class="left-desc">
                <h3 class="content-title">About</h3>
                <div class="about-content">
                    <a class = "link" href="/about">About Us</a>
                    <a class = "link" href="/purchase">Pricing</a>
                </div>
            </div>
            <div class="mid-desc">
                <h3 class="content-title">Contact</h3>
                <div class="contact-content">
                    <p >Email: willcshapiro@gmail.com</p>
                </div>
            </div>
            <div class="right-desc">
                <h3 class="content-title">Links</h3>
                <div class="links-content">
                    <a href="https://twitter.com/niftyprice_io" id="twitter"></a>
                </div>

            </div>
            </div>
            <div class="copy">© 2021 | niftyprice.io</div>

        </div>
    )

} export default Footer;