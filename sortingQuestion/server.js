const Hapi=require('hapi');

// Create a server with a host and port
const server=Hapi.server({
    host:'localhost',
    port:8000
});

// Add the route
server.route({
    method:'GET',
    path:'/comparator',
    handler:function(request,h) {
        const left = parseInt(request.query.a);
        const right = parseInt(request.query.b);

        if(left > right) {
            return 1;
        } else if(left < right) {
            return -1;
        } else {
            return 0;
        }
    }
});

const start =  async function() {

    try {
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
};

start();