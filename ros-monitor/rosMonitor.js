// Connecting to ROS
// -----------------
var ros = new ROSLIB.Ros();

// If there is an error on the backend, an 'error' emit will be emitted.
ros.on('error', function(error) {
       document.getElementById('connecting').style.display = 'none';
       document.getElementById('connected').style.display = 'none';
       document.getElementById('closed').style.display = 'none';
       document.getElementById('error').style.display = 'inline';
       console.log(error);
       });

   // Find out exactly when we made a connection.
   ros.on('connection', function() {
          console.log('Connection made!');
          document.getElementById('connecting').style.display = 'none';
          document.getElementById('error').style.display = 'none';
          document.getElementById('closed').style.display = 'none';
          document.getElementById('connected').style.display = 'inline';
          });

  ros.on('close', function() {
         console.log('Connection closed.');
         document.getElementById('connecting').style.display = 'none';
         document.getElementById('connected').style.display = 'none';
         document.getElementById('closed').style.display = 'inline';
         });

 // Create a connection to the rosbridge WebSocket server.
 ros.connect('ws://192.168.1.4:9090');


var N = 12
var robot = Array(N);
var delta_x = 0
var delta_y = 0
var distance_k = 0

var robot_x = ""
var robot_y = ""
var robot_w = ""
var robot_number = ""


for (i=0; i<N; i++){

    robot[i] = new ROSLIB.Topic({
         ros : ros,
         name : '/robot_' + i + '/base_pose_ground_truth',
         messageType : 'nav_msgs/Odometry'
         });
}

for (i=0; i<N; i++){
        
    robot[i].subscribe(function(message) {
       robot_number = parseInt(message.header.frame_id.split("/")[1].split("_")[1]);
       robot_x = parseFloat(message.pose.pose.position.x)
       robot_y = parseFloat(message.pose.pose.position.y)
       robot_w = parseFloat(message.pose.pose.orientation.w)

       d3.select("#robot_x_" + robot_number)
       .attr("cx", xscale(robot_x))
       .attr("cy", yscale(robot_y))
       .transition();


       dataset.nodes[robot_number].coordination  = {"x": robot_x, "y": robot_y, "w": robot_w};

       for (k=robot_number + 1; k < N; k++) {

           d3.select("#edge" + robot_number + "_" + k)
               .attr("x1", xscale(dataset.nodes[robot_number].coordination.x))
               .attr("y1", yscale(dataset.nodes[robot_number].coordination.y))
               .attr("x2", xscale(dataset.nodes[k].coordination.x))
               .attr("y2", yscale(dataset.nodes[k].coordination.y))
               .transition();

            delta_x = dataset.nodes[robot_number].coordination.x - dataset.nodes[k].coordination.x
            delta_y = dataset.nodes[robot_number].coordination.y - dataset.nodes[k].coordination.y
            distance_k = Math.sqrt(delta_x * delta_x + delta_y * delta_y)


            if (distance_k > 1) {

               if (network[robot_number][k] >= .005){
                    network[robot_number][k] -= .005;
                }
                else {
                    network[robot_number][k] = 0;

                }
            }
            else {

                // draw a link
               if (network[robot_number][k] < 5){
                    network[robot_number][k] += .1
                }

            }
            d3.select("#edge" + robot_number + "_" + k)
                .attr("stroke","gray")
                .attr("stroke-width", network[robot_number][k]);

       }

    });
}

