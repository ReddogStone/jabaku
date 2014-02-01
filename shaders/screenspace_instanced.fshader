precision mediump float;

varying vec2 vTexCoord;
varying vec4 vColor;

uniform sampler2D uTexture;

void main() {
	vec4 textureColor = texture2D(uTexture, vTexCoord);
	vec4 color = vColor;
	color.rgb *= color.a;
	gl_FragColor = textureColor * color;
}