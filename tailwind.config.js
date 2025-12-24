/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors:{
        primary:"#56cfe1",
        secondary:"#0077b6",
        grey:"#33415c",
        background: "#F7F7F7",
      },
      fontFamily:{
        mthin:["Montserrat-Thin"],
        mextralight:["Montserrat-ExtraLight"],
        mlight:["Montserrat-Light"],
        mregular:["Montserrat-Regular"],
        mmedium:["Montserrat-Medium"],
        msemibold:["Montserrat-SemiBold"],
        mbold:["Montserrat-Bold"],
        mextrabold:["Montserrat-ExtraBold"],
        mblack:["Montserrat-black"]
      }
    },
  },
  plugins: [],
}