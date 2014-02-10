precision mediump float;

varying vec2 vTexCoord;

uniform sampler2D uTexture;

void main() {
	gl_FragColor = vec4(texture2D(uTexture, vTexCoord).rgb, 1.0);
}