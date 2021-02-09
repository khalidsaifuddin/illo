import React from 'react';
import { Page, Navbar, List, ListItem } from 'framework7-react';

export default class extends React.Component {
  constructor() {
    super();

    this.state = {
      products: null,
    }
  }
  kembali(){
    alert('tses');
  }
  render() {
    return (
      <Page name="catalog">
        <Navbar title="Catalog" backLink="Kembali" />
        <List>
          <ListItem link="/about/" title="About"/>
          <ListItem link="/form/" title="Form"/>
        </List>
      </Page>
    );
  }
}