package leotech.cms.handler.tracking;

import java.util.Optional;

import io.vertx.core.Handler;
import io.vertx.core.eventbus.EventBus;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;
import io.vertx.ext.bridge.BridgeEventType;
import io.vertx.ext.web.handler.sockjs.BridgeEvent;
import leotech.cms.service.RealtimeDataService;

public class RealtimeDataHandler implements Handler<BridgeEvent>{
    private static final Logger logger = LoggerFactory.getLogger(RealtimeDataHandler.class);
    private final EventBus eventBus;
    private final RealtimeDataService repository;

    public RealtimeDataHandler(EventBus eventBus, RealtimeDataService repository) {
        this.eventBus = eventBus;
        this.repository = repository;
    }

    @Override
    public void handle(BridgeEvent event) {
	
        if (event.type() == BridgeEventType.SOCKET_CREATED)
            logger.info("A socket was created");

        if (event.type() == BridgeEventType.SEND)
            clientToServer();

        event.complete(true);
    }

    private void clientToServer() {
        Optional<Integer> counter = repository.get();
        if (counter.isPresent()) {
            Integer value = counter.get() + 1;
            repository.update(value);
            eventBus.publish("out", value);
        } else {
            Integer value = 1;
            repository.update(value);
            eventBus.publish("out", value);
        }
    }
}
