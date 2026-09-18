const webflowCompatibilityCss = `
/* Keep Webflow's global typography from changing the embedded AUS design. */
body{
  font-family:var(--font-body,var(--font-display,Inter,sans-serif));
  font-size:16px;
  font-weight:400;
  line-height:normal;
  letter-spacing:normal;
}
h1,h2,h3,h4,h5,h6{
  margin:0;
  font-weight:700;
  line-height:normal;
  letter-spacing:normal;
}
h1{font-size:2em;}
h2{font-size:1.5em;}
h3{font-size:1.17em;}
h4{font-size:1em;}
h5{font-size:.83em;}
h6{font-size:.67em;}
p{margin:0;font-size:inherit;font-weight:400;line-height:normal;letter-spacing:normal;opacity:1;}
ul,ol{margin:0;padding:0;}
blockquote,figure,dl,dd{margin:0;}
button,input,optgroup,select,textarea{font-family:inherit;letter-spacing:normal;}
`;

module.exports = { webflowCompatibilityCss };
