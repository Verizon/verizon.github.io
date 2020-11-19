import React, {Component} from 'react';
import HomePage from '../pages/home';  
import Header from '../components/header';
import Footer from '../components/footer';

class IndexPage extends Component {
    render(){
        return (
            <div>
                <Header/>
                <HomePage/>
                <Footer/>
            </div>
        );
    }
}

export default IndexPage;


