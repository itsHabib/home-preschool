import {writeFileSync} from 'node:fs'
const paths={
 sun:'<circle cx="60" cy="60" r="26"/><path d="M60 8v16M60 96v16M8 60h16M96 60h16M23 23l12 12M85 85l12 12M23 97l12-12M85 35l12-12"/>',
 cup:'<path d="M24 27h60v58q-30 25-60 0zM84 35h10q24 18 0 36H84"/>',
 sock:'<path d="M48 10h38v64q0 10-11 15l-35 19q-21 9-29-8q-7-14 10-23l27-15zM48 24h38"/>',
 ball:'<circle cx="60" cy="60" r="46"/><path d="M24 31q66 0 63 69M29 96q0-64 70-66M15 61h90"/>',
 towel:'<path d="M22 14h76v89H22zM22 26h76M22 87h76M30 103v10M43 103v10M56 103v10M69 103v10M82 103v10M95 103v10"/>',
 apple:'<path d="M60 33C15 5 0 60 29 96Q42 112 60 102Q80 113 94 92C123 49 98 11 60 33ZM60 33Q56 16 68 7M65 22Q84 0 98 12Q85 31 65 22"/>'
}
for(const [id,s] of Object.entries(paths))writeFileSync(`art/${id}.svg`,`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" role="img" aria-label="${id}"><g fill="white" stroke="#111" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${s}</g></svg>\n`)
