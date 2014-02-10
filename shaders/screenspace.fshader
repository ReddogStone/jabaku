precision mediump float;

varying vec2 vTexCoord;

uniform sampler2D uTexture;
uniform vec4 uColor;

void main() {
	vec4 textureColor = texture2D(uTexture, vTexCoord);
	vec4 color = uColor;
	color.rgb *= color.a;

	float val = textureColor.r;

	gl_FragColor = vec4(val, val, val, textureColor.a);
}