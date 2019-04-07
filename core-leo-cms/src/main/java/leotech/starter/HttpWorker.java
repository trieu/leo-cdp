package leotech.starter;

import org.apache.http.HttpStatus;

import com.google.gson.Gson;

import io.vertx.core.eventbus.EventBus;
import io.vertx.core.http.HttpServer;
import io.vertx.core.shareddata.SharedData;
import io.vertx.ext.bridge.PermittedOptions;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;
import io.vertx.ext.web.handler.BodyHandler;
import io.vertx.ext.web.handler.sockjs.BridgeOptions;
import io.vertx.ext.web.handler.sockjs.SockJSHandler;
import leotech.cms.handler.tracking.RealtimeDataHandler;
import leotech.cms.service.RealtimeDataService;
import leotech.core.api.BaseHttpRouter;
import leotech.core.config.HttpRoutingConfigs;
import leotech.system.util.CmsLogUtil;
import rfx.core.stream.node.worker.BaseWorker;

public class HttpWorker extends BaseWorker {

    private static final String EVENTBUS = "/eventbus/*";

    static HttpWorker instance;

    final HttpRoutingConfigs httpRoutingConfigs;

    public HttpRoutingConfigs getHttpRoutingConfigs() {
	return httpRoutingConfigs;
    }

    protected HttpWorker(String workerName) {
	super(workerName);

	httpRoutingConfigs = HttpRoutingConfigs.load(workerName);
	if (httpRoutingConfigs == null) {
	    throw new IllegalArgumentException("not valid workerName in " + HttpRoutingConfigs.CONFIGS_HTTP_ROUTING_CONFIGS_JSON);
	} else {
	    System.out.println("loaded config " + new Gson().toJson(httpRoutingConfigs));
	}
    }

    /**
     * Create new AdDeliveryWorker instance with implemented httpHandler
     * 
     * @param host
     * @param port
     * @param httpHandler
     */
    public static void start(String workerName) {
	CmsLogUtil.setLogLevelToInfo();
	System.setProperty("vertx.disableFileCPResolving", "true");

	instance = new HttpWorker(workerName);
	String host = instance.httpRoutingConfigs.getHost();
	int port = instance.httpRoutingConfigs.getPort();
	instance.start(host, port);
    }

    @Override
    protected void onStartDone() {
	System.out.println(name + " is loaded ...");
    }

    public static HttpWorker getInstance() {
	if (instance == null) {
	    throw new IllegalAccessError("startNewInstance must called before getInstance");
	}
	return instance;
    }

    @Override
    public void start(String host, int port) {
	Router router = Router.router(vertxInstance);

	// for HTTP POST upload or Ajax POST submit
	if (httpRoutingConfigs.isBodyHandlerEnabled()) {
	    // the system must using POST as JsonDataPayload
	    router.route().handler(BodyHandler.create());
	}

	// WebSocket
	if (httpRoutingConfigs.isSockJsHandlerEnabled()) {
	    router.route(EVENTBUS).handler(eventBusHandler());
	}

	// find the class and create new instance
	router.route().handler(context -> {
	    try {
		String className = httpRoutingConfigs.getClassNameHttpRouter();
		Class<?> myClass = Class.forName(className);
		BaseHttpRouter obj = (BaseHttpRouter) myClass.getConstructor(RoutingContext.class).newInstance(context);
		obj.handle();
	    } catch (Throwable e) {
		e.printStackTrace();
		String err = e.getMessage();
		context.response().setStatusCode(HttpStatus.SC_INTERNAL_SERVER_ERROR).end(err);
	    }
	});

	HttpServer server = checkAndCreateHttpServer(host, port);
	if (server == null) {
	    System.err.println("registerWorkerHttpRouter return NULL value");
	    return;
	}
	server.requestHandler(router).listen(port, host);
	registerWorkerNodeIntoCluster();
    }

    final SockJSHandler eventBusHandler() {
	BridgeOptions options = new BridgeOptions().addOutboundPermitted(new PermittedOptions().setAddressRegex("out"))
		.addInboundPermitted(new PermittedOptions().setAddressRegex("in"));

	SharedData data = vertxInstance.sharedData();
	RealtimeDataService repository = new RealtimeDataService(data);
	EventBus eventBus = vertxInstance.eventBus();
	RealtimeDataHandler counterHandler = new RealtimeDataHandler(eventBus, repository);

	SockJSHandler sockJSHandler = SockJSHandler.create(vertxInstance);
	return sockJSHandler.bridge(options, counterHandler);
    }

}