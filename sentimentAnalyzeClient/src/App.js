import './bootstrap.min.css';
import './App.css';
import EmotionTable from './EmotionTable.js';
import React from 'react';

class App extends React.Component {
  state = {innercomp:<textarea rows="4" cols="50" id="textinput"/>,
    mode: "text",
    sentimentOutput:[],
    sentiment:true
  }

  renderTextArea = ()=>{
    document.getElementById("textinput").value = "";
    if(this.state.mode === "url") {
      this.setState({innercomp:<textarea rows="4" cols="50" id="textinput"/>,
        mode: "text",
        sentimentOutput:[],
        sentiment:true
      })
    }
  }

  renderTextBox = ()=>{
    document.getElementById("textinput").value = "";
    if(this.state.mode === "text") {
      this.setState({innercomp:<textarea rows="1" cols="50" id="textinput"/>,
        mode: "url",
        sentimentOutput:[],
        sentiment:true
      })
    }
  }

  sendForSentimentAnalysis = () => {
    this.setState({sentiment:true});
    let url = ".";

    if(this.state.mode === "url") {
      url = url+"/url/sentiment?url="+document.getElementById("textinput").value;
    } else {
      url = url+"/text/sentiment?text="+document.getElementById("textinput").value;
    }
    fetch(url).then((response)=>{
      response.text().then((data)=>{
        this.setState({sentimentOutput:data});
        let output = data;
        data = data.replace(/\"/g, ""); // I think that this is ugly, shold be possible to use parsers
        if(data === "positive") {
          output = <div style={{color:"green",fontSize:20}}>{data}</div>
        } else if (data === "negative"){
          output = <div style={{color:"red",fontSize:20}}>{data}</div>
        } else {
          output = <div style={{color:"orange",fontSize:20}}>{data}</div>
        }
        this.setState({sentimentOutput:output});
      })
    });
  }

  sendForEmotionAnalysis = () => {

    this.setState({sentiment:false});
    let url = ".";
    if(this.state.mode === "url") {
      url = url+"/url/emotion?url="+document.getElementById("textinput").value;
    } else {
      url = url+"/text/emotion/?text="+document.getElementById("textinput").value;
    }
    fetch(url).then((response)=>{
      response.json().then((data)=>{
        this.setState({sentimentOutput:<EmotionTable emotions={data}/>});
      })})  ;
  }


  render() {
    return (
        <div className="App">
          Please ensure that the text inserted is long enough for Waston to be able to analyse it.
          <br/>
          Sample text:
          <br/>
          Under the IBM Board Corporate Governance Guidelines, the Directors and Corporate Governance Committee and the full Board annually review the financial and other relationships between the independent directors and IBM as part of the assessment of director independence. The Directors and Corporate Governance Committee makes recommendations to the Board about the independence of non-management directors, and the Board determines whether those directors are independent. In addition to this annual assessment of director independence, independence is monitored by the Directors and Corporate Governance Committee and the full Board on an ongoing basis.
          <br/>
          <title>Sentiment Analyzer</title>
          <button className="btn btn-info" onClick={this.renderTextArea}>Text</button>
          <button className="btn btn-dark"  onClick={this.renderTextBox}>URL</button>
          <br/><br/>
          {this.state.innercomp}
          <br/>
          <button className="btn-primary" onClick={this.sendForSentimentAnalysis}>Analyze Sentiment</button>
          <button className="btn-primary" onClick={this.sendForEmotionAnalysis}>Analyze Emotion</button>
          <br/>
          {this.state.sentimentOutput}
        </div>
    );
  }
}

export default App;