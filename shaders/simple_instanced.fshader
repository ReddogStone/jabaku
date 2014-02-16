precision mediump float;

varying vec3 vNormal;
varying vec2 vTexCoord;
varying vec3 vWorldPos;
varying vec4 vColor;
varying vec4 vLumDiffSpecId;

uniform sampler2D uTexture;
uniform sampler2D uDepthTexture;
uniform vec3 uPosCamera;
uniform vec3 uPosLight1;
uniform vec3 uColorLight1;
uniform vec3 uPosLight2;
uniform vec3 uColorLight2;
uniform vec3 uAmbient;

void main() {
	vec3 normal = normalize(vNormal);
	vec4 textureColor = texture2D(uTexture, vTexCoord);
	
	vec3 toLight1 = normalize(uPosLight1 - vWorldPos);
	vec3 toLight2 = normalize(uPosLight2 - vWorldPos);
	vec3 diffuse1 = uColorLight1 * abs(dot(toLight1, normal));
	vec3 diffuse2 = uColorLight2 * abs(dot(toLight2, normal));

	vec3 fromCamera = normalize(vWorldPos - uPosCamera);
	vec3 reflected1 = reflect(toLight1, normal);
	vec3 reflected2 = reflect(toLight2, normal);

	float specular1 = pow(max(dot(reflected1, fromCamera), 0.0), 32.0);
	float specular2 = pow(max(dot(reflected2, fromCamera), 0.0), 32.0);
	vec3 white = vec3(1.0, 1.0, 1.0);

	vec3 diffuse = diffuse1 + diffuse2;
	vec3 specular = (specular1/* + specular2*/) * white;

	textureColor.rgb *= (/*specular + */(diffuse + uAmbient) * vColor.rgb) * vColor.a;
	textureColor.rgb += vColor.rgb * vLumDiffSpecId.x * textureColor.a * vColor.a;
	textureColor.a = vColor.a;

	gl_FragColor = vec4(textureColor.rgb, textureColor.a);
}