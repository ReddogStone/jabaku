precision mediump float;

varying vec2 vTexCoord;

uniform sampler2D uTexture;
uniform vec4 uColor;

void main() {
	vec4 textureColor = texture2D(uTexture, vTexCoord);
	vec4 color = uColor;
	color.rgb *= color.a;

	gl_FragColor = textureColor * color;
}