const printCss = `
  @page {
    size: auto;
    margin: 0;
  }
  body{line-height: 1.2; font-size: 12px !important, font-family: 'Times New Roman',Times,serif;}
  .print { font-size: 12px; padding-left: 75px; padding-right: 135px }
  .float-left{float: left;} .float-right{float: right;} 
  .text-red {color: red}
  .text-uppercase {text-transform: uppercase;}
  .text-center {text-align: center;} .text-left{text-align: left;} .text-right{text-align: right;}
  .font-bold {font-weight: bold;} .font-ilatic{font-style: italic;}
  .p-3{padding: 30px;} .py-3{padding: 30px 0px;} .px-3{padding: 0px 30px;}
  .p-2{padding: 20px;} .py-2{padding: 20px 0px;} .px-2{padding: 0px 20px;}
  .p-1{padding: 10px;} .py-1{padding: 10px 0px;} .px-1{padding: 0px 10px;}
  .m-2{margin: 20px;} .my-2{margin: 20px 0px;} .mx-2{margin: 0px 20px;}
  .m-1{margin: 10px;} .my-1{margin: 10px 0px;} .mx-1{margin: 0px 10px;}
  .pb-1{padding-bottom: 10px;}
  .pb-2{padding-bottom: 20px;} 
  .pt-3{padding-top: 30px;} 
  .pb-4{padding-bottom: 60px;} 
  .pr-1{padding-right: 10px}
  .pr-2{padding-right: 20px !important;}
  .pr-3{padding-right: 30px !important;}
  .d-flex {display: flex}
  h3 {
    font-size: 20px;
    font-weight: normal;
  }
  table{border-collapse: collapse;border-spacing: 0;}
  tr{border-bottom: 1px solid #ccc;}
  th, td{text-align: left;padding: 4px;}
  ol, ul {list-style: none;}
  .header {
    padding-bottom: 5px !important;
    font-size: 20px;
    display: flex;
    padding: 30px;
  }
  .eximrs-img {
    width: 150px;
    height: 80px;
    // padding-left: 10px;
    padding-right: 75px;
  }
  .header-height {
    margin: 1px;
  }
  .priority {
    border: 1px solid #E8F9F0;
    color: #22A45D;
    background-color: #E8F9F0 !important;
    width: 100px;
    // padding-left: 15px;
    padding: 5px;
    border-radius: 10px;
  }
  .header-qr {
    text-align: center;
    width: 800px;
  }
  .img-qr {
    position: absolute;
    left: 90px;
  }
  .content-body {
    text-align: justify;
    font-size: 18px !important;
    width: 800px !important;
  }

  .footer {
    display: flex;
    padding-top: 25px !important;
    justify-content: space-between;
    text-align: center;
    font-size: 20px;
    page-break-after: always;
    .footer-width {
      width: 50px;
    }
  }
`

export function printHTML(content = []) {
  try {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);
    const pri = iframe.contentWindow;
    pri.document.open();
    const totalContent = content?.join("")?.trim()
    const html = `
    <body>
      <style type="text/css" media="print">${printCss}</style>
      <div class="print">
        ${totalContent}
      </div>
    </body>
  `
    pri.document.write(html);
    setTimeout(
      function () {
        pri.document.close();
        pri.focus();
        pri.print();
        pri.close();
        pri.onafterprint = () => { document.body.removeChild(iframe); clearTimeout(); }
      }, (500)
    ); 
  } catch (err) {
    console.log('err', err)
  }
}