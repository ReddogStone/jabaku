precision mediump float;

varying vec2 vTexCoord;

uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform sampler2D uTexture3;
uniform sampler2D uTexture4;

void main() {
	vec4 c1 = texture2D(uTexture1, vTexCoord);
	vec4 c2 = texture2D(uTexture2, vTexCoord);
	vec4 c3 = texture2D(uTexture3, vTexCoord);
	vec4 c4 = texture2D(uTexture4, vTexCoord);
	vec3 color = c1.rgb * c1.a + 
		(1.0 - c1.a) * (c2.rgb * c2.a +
		(1.0 - c2.a) * (c3.rgb * c3.a +
		(1.0 - c3.a) * (c4.rgb * c4.a)));
	gl_FragColor = vec4(color, 1.0);
}