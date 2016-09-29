varying float NdotL;
varying vec3 ReflectVec;
varying vec3 ViewVec;

//Values used for fragment shader lighting calculations
out vec3 N;
out vec3 v;

void main () {

        //Calculate normal values to get positions and differing colour values
	vec3 ecPos = vec3(gl_ModelViewMatrix * gl_Vertex);
	vec3 tnorm = normalize(gl_NormalMatrix * gl_Normal);
	vec3 lightVec = normalize(gl_LightSource[0].position.xyz - ecPos);
	ReflectVec = normalize(reflect(-lightVec, tnorm));
	ViewVec = normalize(-ecPos);
	NdotL = (dot(lightVec, tnorm) + 1.0) * 0.5;
	gl_Position = ftransform();
	gl_FrontColor = vec4(vec3(0.75), 1.0);
	gl_BackColor = vec4(0.0);

	v = vec3(gl_ModelViewMatrix * gl_Vertex);

        //Need to transform for eye space
	N = normalize(gl_NormalMatrix * gl_Normal);

        //Finally transform positions for final result
	gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}
