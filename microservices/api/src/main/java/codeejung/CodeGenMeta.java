package codeejung;


import javax.tools.*;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintStream;
import java.io.PrintWriter;
import java.lang.reflect.Method;
import java.net.URI;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;

public class CodeGenMeta {
	
	public static List<ClassJavaFileObject> compile(String program,String fileName) throws Exception
	{
		
		 ByteArrayOutputStream baos = new ByteArrayOutputStream();
		 
			    JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();

			    JavaFileObject compilationUnit =
			        new StringJavaFileObject(fileName, program);

			    SimpleJavaFileManager fileManager =
			        new SimpleJavaFileManager(compiler.getStandardFileManager(null, null, null));

			    JavaCompiler.CompilationTask compilationTask = compiler.getTask(
			        new PrintWriter(baos), fileManager, null, null, null, Arrays.asList(compilationUnit));

			    compilationTask.call();
			    
			    String error=baos.toString();
			    
			    if(!error.equals(""))
			    {
			    	throw new Exception(error);
			    }
			    
			    
			    
			    
			    
		return fileManager.getGeneratedOutputFiles();
	}
	
	public static String run(List <ClassJavaFileObject> bytecodes,String className,String ip) throws Exception
	{
		CompiledClassLoader classLoader=new CompiledClassLoader(bytecodes);
		Class<?> codeGenTest = classLoader.loadClass(className);
	    Method main = codeGenTest.getMethod("main", String[].class);
	    
	    ByteArrayOutputStream baos = new ByteArrayOutputStream();
	    PrintStream ps = new PrintStream(baos);
	    // IMPORTANT: Save the old System.out!
	    
	    ByteArrayInputStream bais=new ByteArrayInputStream(ip.getBytes());
	    
	    InputStream inOld=System.in;
	    
	    System.setIn(bais);
	    
	    PrintStream old = System.out;
	    // Tell Java to use your special stream
	    System.setOut(ps);
	    // Print some output: goes to your special stream
	    main.invoke(null, new Object[]{null});
	    // Put things back
	    System.out.flush();
	    System.setIn(inOld);
	    System.setOut(old);
	    // Show what happened
	    return baos.toString();
	    
	 
	}
	
  public static void main(String[] args)  {
	  
    String program = "import java.util.*;" +
        "public class CodeGenTest {\n" +
        "  public static void main(String[] args) {\n" +
        "    System.out.println(\"Hello World, from a generated program!\"+new Scanner(System.in).nextLine());\n" +
        "  \n" +
        "return;}"+
        "}\n";
    
    try {
		System.out.println(run(compile(program,"CodeGenTest.java"),"CodeGenTest","ramesh"));
	} catch (Exception e) {
		System.out.println(e.getMessage());
	}

  }

  private static class StringJavaFileObject extends SimpleJavaFileObject {
    private final String code;

    public StringJavaFileObject(String name, String code) {
      super(URI.create("string:///" + name.replace('.', '/') + Kind.SOURCE.extension),
          Kind.SOURCE);
      this.code = code;
    }

    @Override
    public CharSequence getCharContent(boolean ignoreEncodingErrors) throws IOException {
      return code;
    }
  }

  private static class ClassJavaFileObject extends SimpleJavaFileObject {
    private final ByteArrayOutputStream outputStream;
    private final String className;

    protected ClassJavaFileObject(String className, Kind kind) {
      super(URI.create("mem:///" + className.replace('.', '/') + kind.extension), kind);
      this.className = className;
      outputStream = new ByteArrayOutputStream();
    }

    @Override
    public OutputStream openOutputStream() throws IOException {
      return outputStream;
    }

    public byte[] getBytes() {
      return outputStream.toByteArray();
    }

    public String getClassName() {
      return className;
    }
  }

  private static class SimpleJavaFileManager extends ForwardingJavaFileManager {
    private final List<ClassJavaFileObject> outputFiles;

    protected SimpleJavaFileManager(JavaFileManager fileManager) {
      super(fileManager);
      outputFiles = new ArrayList<ClassJavaFileObject>();
    }

    @Override
    public JavaFileObject getJavaFileForOutput(Location location, String className, JavaFileObject.Kind kind, FileObject sibling) throws IOException {
      ClassJavaFileObject file = new ClassJavaFileObject(className, kind);
      outputFiles.add(file);
      return file;
    }

    public List<ClassJavaFileObject> getGeneratedOutputFiles() {
      return outputFiles;
    }
  }

  private static class CompiledClassLoader extends ClassLoader {
    private final List<ClassJavaFileObject> files;

    private CompiledClassLoader(List<ClassJavaFileObject> files) {
      this.files = files;
    }

    @Override
    protected Class<?> findClass(String name) throws ClassNotFoundException {
      Iterator<ClassJavaFileObject> itr = files.iterator();
      while (itr.hasNext()) {
        ClassJavaFileObject file = itr.next();
        if (file.getClassName().equals(name)) {
          itr.remove();
          byte[] bytes = file.getBytes();
          return super.defineClass(name, bytes, 0, bytes.length);
        }
      }
      return super.findClass(name);
    }
  }
}