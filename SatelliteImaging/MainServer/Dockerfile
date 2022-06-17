FROM tensorflow/serving

ENV MODEL_BASE_PATH /satellite_Server
#ENV MODEL_NAME satellite_Server
# MODEL_NAME we wont set as we have multiple models


COPY satellite_Server /satellite_Server

# Fix because base tf_serving_entrypoint.sh does not take $PORT env variable while $PORT is set by Heroku
# CMD is required to run on Heroku
COPY tf_serving_entrypoint.sh /usr/bin/tf_serving_entrypoint.sh
RUN chmod +x /usr/bin/tf_serving_entrypoint.sh
ENTRYPOINT []
CMD ["/usr/bin/tf_serving_entrypoint.sh"]
