precision mediump float;

varying vec4 vLumDiffSpecId;

void main() {
	float id = vLumDiffSpecId.w;
	gl_FragColor = vec4(id, id, id, 1.0);
}