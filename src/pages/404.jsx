import React from 'react';
import { Page, Navbar, Block } from 'framework7-react';

export default () => (
  <Page className="devPageInduk">
    <Navbar title="Menu dalam Pengembangan" backLink="Kembali" />
    <Block strong className="devPage">
      <img src="./static/icons/810.jpg" style={{width:'80%'}} />
      {/* <i className="icons f7-icons" style={{fontSize:'100px'}}>hammer_fill</i> */}
      <h2>Tunggu sebentar ya...</h2>
      <h4>Kami masih dalam proses membuat sesuatu yang menyenangkan di sini! Mohon bersabar sebentar lagi ya :)</h4>
      {/* <p>Maaf</p> */}
      {/* <p>Halaman yang Anda maksud sedang dalam pengembangan</p> */}

      {/* <i className="icons f7-icons">gear_alt_fill</i>
      <i className="icons f7-icons">gear_alt_fill</i>
      <i className="icons f7-icons">gear_alt_fill</i> */}

    </Block>
  </Page>
);
