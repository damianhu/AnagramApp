import './App.css';
import React , {Component} from 'react';
import axios from 'axios';

export default class App extends Component{


    constructor(props) {
        super(props);
        this.state = {
            string1: '',
            string2: '',
            words: [],
            isLoaded: false //set initial data
        };

    }

    componentDidMount(){
        const _this=this;
        axios.get('http://127.0.0.1:5000/topten') //fetch the data of top ten anagram
            .then(function (response) {
                _this.setState({
                    words:response.data.split("#"),
                    isLoaded:true
                });
            })
            .catch(function (error) {
                console.log(error);
                _this.setState({
                    isLoaded:false,
                    error:error
                })
            })
    }


    handleChange = (e) => {
        if(e.target.name === 'FirstString') {
            this.setState({
                string1: e.target.value,
            })
        }else if(e.target.name==='SecondString'){
            this.setState({
                string2: e.target.value,
            })
        }
    }




    onSubmit = (e) => {
        // e.preventDefault();
        axios.get(`http://127.0.0.1:5000/compare/`+this.state.string1+`/`+this.state.string2 )
            .then(res =>{
                const notice = res.data
                alert(notice)
            })
        this.setState({
            string1: '',
            string2: '',
        })
    }

    render() {
        if(!this.state.isLoaded){
            return <div>loading</div>
        }else {
            return (
                <div className="App">
                    <header className="App-header" id="appheader">
                        <div className="dropdown">
                            <button className="dropbtn"> Topten</button>
                            <div className="dropdown-content">
                                {
                                    this.state.words.map((word) => {
                                        word = word.replace("+", " and ")
                                        return (<a href="#">{word}</a>)
                                    })
                                }
                            </div>
                        </div>
                        <p>
                            Anagram APP
                        </p>
                        <form>
                            <p>
                                <div className="block">
                                    <label>First:</label>
                                    <input
                                        name='FirstString'
                                        value={this.state.string1}
                                        onChange={e => this.handleChange(e)}
                                        align="left"
                                    />
                                </div>
                                <br></br>
                                <div className="block">
                                    <label>Second:</label>
                                    <input
                                        name='SecondString'
                                        value={this.state.string2}
                                        onChange={e => this.handleChange(e)}
                                    />
                                </div>
                            </p>
                            <button onClick={(e) => this.onSubmit(e)}>Send</button>
                        </form>
                    </header>
                </div>
            );
        }
    }

}



