import React from 'react';
import axios from 'axios';

import { getToken } from './services/tokenService';

import addLight from './assets/icon-add-light.svg';
import H2 from './components/H2/H2';
import H3 from './components/H3/H3';
import Paragraph from './components/Paragraph/Paragraph';
import Header from './components/Header/Header';
import ButtonWithIcon from './components/ButtonWithIcon/ButtonWithIcon';
import FormGrant from './components/FormGrant/FormGrant';
import GrantCard from './components/GrantCard/GrantCard';
import Tags from './components/Tags/Tags';

class PageGrants extends React.Component {
  state = {
    grants: [],
    visibleForm: false,
    visibleGrant: false,
    updated: false,
    tag: null,
    tagArray: [],
    formatTagArray: [],
    class: null
  }

  refresh = () => {
    const token = getToken();
    // axios is a promise-based api
    // so you can chain .then and use callback for response
    // make sure you on the CORRECT PORT (ie not 3000)
    // do not make a get request to a specific domain 
    // e.g.  axios.get('localhost:8080/hello')
    // because you will get a CORs error
    // AND because you may not be using that port all the time
    // use a proxy! add "proxy": "http://localhost:8080" to package.json
    axios
    .get('/grants/all', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      const grants = res.data.payload;
      this.uniqueTagArray(grants)
      this.setState({
        grants
      })
    });
  }

  filterTags = tag => {
    this.setState({ tag })
  }

  uniqueTagArray = data => {
    let tagArray = []
    data.map(grant => (grant.tags).map(tag => tagArray.push(tag)))
    console.log(tagArray);
    let tagArrayNoDupes = Array.from(new Set(tagArray))
    
    this.setState({
      tagArray: tagArrayNoDupes
    })
  }

  // update = () => {
  //   this.setState({
  //     updated: true
  //   })
  //   this.refresh();
  // }

  showForm = e => {
    e.preventDefault();
    this.setState({
      visibleForm: true
    })
  }

  hideForm = e => {
    e.preventDefault();
    this.setState({
      visibleForm: false
    }) 
    this.refresh();
  }

  showGrant = () => {
    this.setState({
      visibleGrant: true
    }) 
  }

  hideGrant = () => {
    this.setState({
      visibleGrant: false
    }) 
  }
    
  componentDidMount() { 
    this.refresh();
  }

  render() {
    return (
      <main className="page__grants">
        {this.state.visibleForm ?
          <FormGrant name="form-grants" id="form-grants" hideForm={this.hideForm} update={this.refresh}/>
          : <React.Fragment>
              <Header />
              <section className="page__grants__container">
                <ButtonWithIcon type={addLight} text="Add a Grant" action={this.showForm} />

                <H3 extraClass="page__grants__stat--total" text="Total Grants" />
                <Paragraph extraClass="page__grants__number--total" text={this.state.grants.length} />
                <H3 extraClass="page__grants__stat" text="Applied" />
                <Paragraph extraClass="page__grants__number" text={this.state.grants.filter(grant => grant.status === 2 || grant.status === 3 || grant.status === 4).length} />
                <H3 extraClass="page__grants__stat" text="Granted" />
                <Paragraph extraClass="page__grants__number" text={this.state.grants.filter(grant => grant.status === 4).length} />
                <H3 extraClass="page__grants__stat" text="Denied" />
                <Paragraph extraClass="page__grants__number" text={this.state.grants.filter(grant => grant.status === 3).length} /> 
                
                
                <Tags data={this.state.tagArray} filterTags={this.filterTags} selected={this.state.tag}/>

                <H2 text="Upcoming Grants" />
                {this.state.tag ? 
                  
                  // if tag selected, render all the grants with the selected tag
                  this.state.grants
                    .filter(grant => grant.tags.includes(this.state.tag))
                    .map(grant => 
                      <GrantCard 
                      key={grant._id}
                      id={grant._id}
                      name={grant.name}
                      // issuer={grant.issuer}
                      tags={grant.tags}
                      amount={grant.amount}
                      // grantlink={grant.grantLink}
                      granted={grant.granted}
                      due={grant.due}
                      status={grant.status} 
                      action={this.refresh} 
                      filterTags={this.filterTags} />
                    )
                    
                    // else render all the grants in general
                  : this.state.grants.map(grant => 
                    <GrantCard 
                      key={grant._id}
                      id={grant._id}
                      name={grant.name}
                      // issuer={grant.issuer}
                      tags={grant.tags}
                      amount={grant.amount}
                      // grantlink={grant.grantLink}
                      granted={grant.granted}
                      due={grant.due}
                      status={grant.status} 
                      action={this.refresh}
                      filterTags={this.filterTags} />
                    )
                }
              </section>
            </React.Fragment>}
      </main>
    )
  }
}

export default PageGrants;