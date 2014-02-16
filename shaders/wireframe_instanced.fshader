#extension GL_OES_standard_derivatives : require

precision mediump float;

varying vec2 vTexCoord;

void main() {
	vec2 dist = min(vTexCoord, vec2(1.0, 1.0) - vTexCoord);
	vec2 d = fwidth(vTexCoord.xy);
	vec2 a2 = smoothstep(vec2(0.0), d * 1.5, dist.xy);
	float edgeI = 1.0 - min(a2.x, a2.y);
	gl_FragColor = vec4(edgeI, edgeI, edgeI, edgeI);
}