import React, { Component } from 'react';

class Translator extends Component {

    googleTranslateElementInit(){
        new window.google.translate.TranslateElement({pageLanguage: 'auto',}, 'google_translate_element')
    }

    componentDidMount(){
        var addScript = document.createElement('script');
        addScript.setAttribute('src', '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit');        
        document.body.appendChild(addScript);  
        window.googleTranslateElementInit = this.googleTranslateElementInit;
    }

    render() {
        return (
            <div>
                {/* <div id="google_translate_element"></div> */}
            </div>
        )
     }
}
export default Translator;