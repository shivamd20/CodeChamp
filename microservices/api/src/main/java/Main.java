
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintStream;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import codeejung.CodeGenMeta;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.RequestBody;

import spark.*;
import static spark.Spark.port;
import static spark.Spark.post;

/**
 * Created by jaison on 08/03/17.
 */
public class Main {

	public static void main(String[] args) {

		try {
			System.out.println(compileAndRun("java", "latest", "Ramu.java",
					"public class Ramu{public static void main(String [] args){System.out.println(new java.util.Scanner(System.in).next());}}",
					"ramu", "c5746811-352e-439e-82c8-4ca9dadb0eea"));
			
			
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		
		port(getPort());

		Spark.staticFileLocation("static");

		post("/crjava", new Route() {

			@Override
			public Object handle(Request request, Response response) throws Exception {

				try {

					String input = request.headers("input");
					String classname = request.headers("classname");
					String body = request.body();

					System.out.println(input + body + classname);

					if (input == null || input == "")
						throw new Exception("input is null");
					else if (classname == null || classname == "")
						throw new Exception("class name is null");
					else if (body == null || body == "")
						throw new Exception("body is null");

					return CodeGenMeta.run(CodeGenMeta.compile(body, classname), classname, input);

				} catch (Exception e) {

					ByteArrayOutputStream baos = new ByteArrayOutputStream();

					PrintStream ps = new PrintStream(baos);

					e.printStackTrace(ps);
					return baos.toString() + "";
				}

			}
		});

		post("/run", new Route() {

			@Override
			public Object handle(Request request, Response res) throws Exception {

				String input = request.headers("input");
				String fileName = request.headers("filename");
				String content = request.body();
				String language = request.headers("language");
				String version = request.headers("version");
				String token = request.headers("token");

				if (token == null || token.length() < 20) {

					token = "c5746811-352e-439e-82c8-4ca9dadb0eea";
					
				if(language == null || language.equals(""))
					language="java";

				}

				return compileAndRun(language, version, fileName, content, input, token);
			}
		});
	}

	public static final MediaType JSON = MediaType.parse("application/json; charset=utf-8");

	static OkHttpClient client = new OkHttpClient();

	static String compileAndRun(String language, String version, String fileName, String content, String input,
			String token) throws IOException {

		if (version == null || version.equals(""))
			version = "latest";
		
		//Gson gson=new Gson();
		
		JsonObject jobj=new JsonObject();
		
		JsonArray jArray=new JsonArray();
		
		
		JsonObject file=new JsonObject();
		
		if(!(fileName==null||fileName.equals("")))
		file.addProperty("name", fileName);
		
		
		file.addProperty("content", content);
		
		jArray.add(file);
		
		
		jobj.add("files", jArray);
		
		if(!(input==null||input.equals("")))
		jobj.addProperty("stdin", input);;

		String json=jobj.toString();
		
		String url = "https://run.glot.io/languages/" + language + "/" + version;

//		String json = "{ 'files': [ { 'name': '" + fileName + "', 'content': '" + content + "' } ],'stdin':'" + input
//				+ "'}";

		RequestBody body = RequestBody.create(JSON, json);
		okhttp3.Request request = new okhttp3.Request.Builder().url(url).header("Authorization", "Token " + token + "")
				// .addHeader("", "")
				.post(body).build();
		okhttp3.Response response = client.newCall(request).execute();
		return response.body().string();
	}

	// Getting the port
	private static int getPort() {
		String portString = System.getenv("PORT");
		int envPort = 8080;
		if (portString != null) {
			if (portString.length() > 0) {
				int portInt = Integer.parseInt(portString);
				if (portInt != -1)
					envPort = portInt;
			}
		}
		return envPort;
	}
}
