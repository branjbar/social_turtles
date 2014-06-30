Catkin Worspace
===============


	rosrun stage_ros stageros world/swarmlab_multiple_turtlebot.world


------------------------------------------------------------------------
%% how to make a new package for chicken game



	$> source /opt/ros/hydro/setup.bash
	$> cd ~/catkin_ws/src
	$> catkin_init_workspace
	$> cd ..
	$> catkin_make

	$> cd ~/catkin_ws/src/
	$> catkin_create_pkg chicken_game roscpp rospy geometry_msgs sensor_msgs nav_msgs
	$> cd ..
	$> source devel/setup.bash
	$> roscd chicken_game
	
% copy the stage_random_walk.py file in the 'script' folder.

	$> chmod +x scripts/[name of your file]
	$> cd ../..
	$> catkin_make
	$> source devel/setup.bash
	$> rosrun chicken_game stage_random_walk.py
	or you can make a launch file in chicken_game folder as following

		<launch>
		<node pkg="stage_ros" type="stageros" name="stageros" args="$(find chicken_game)/world/swarmlab_multiple_turtlebot.world" respawn="false" output="screen" />
		<node pkg="chicken_game" type="stage_random_walk.py" name="robot_0"  output="screen" />
		<node pkg="chicken_game" type="stage_random_walk.py" name="robot_1"  output="screen" />
		<node pkg="chicken_game" type="stage_random_walk.py" name="robot_2" output="screen" />
		</launch>


	$> source devel/setup.bash
	$> roslaunch chicken_game chicken_game.launch


-----------------------------
% now, you can edit your file using:

	$> rosed chicken_game stage_random_walk.py

% the dependecies of the package can be reviewed by following command

	$> rospack depends1 chicken_game



Cloning the repository
============================================

After adding the ssh public key of the machine to github website, then I cloned the complete repository and made a symbol link to the package from the catkin worspace.
	
	git clone git@github.com:branjbar/social_turtles.git
 
	ln -s ~/sandbox/social_turtles/stage-package/chicken_game/ ~/catkin_ws/src/chicken_game


------------------------------------------------------------------------
%% helpful sample codes for ros scripts in python
follow these links:
* http://wiki.ros.org/ROS/Tutorials/WritingServiceClient%28python%29


standard rospy loop; 

the rospy.loginfo(str) performs triple-duty:
the messages get printed to screen, it gets written to the Node's log file, and it gets written to rosout. 

rosout is a handy for debugging: you can pull up messages using rqt_console instead of having to find the console window with your Node's output.


	def listener():
		rospy.init_node('listener',anonymous=True)
		for i in xrange(10):
    			a = rospy.Subscriber('robot_' + str(i) + "/base_pose_ground_truth", Odometry, get_pose)

		r = rospy.Rate(10) # 10hz
		while not rospy.is_shutdown():
			str = "hello world %s"%rospy.get_time()
			rospy.loginfo(str)
			talker(mode)
			r.sleep()

% for main part of the python code we can use following

	if __name__ == '__main__':
		global robot1, robot2, robot3
		import sys
		try:
			robot1 = sys.argv[1]
		except:
			print 'ERROR: no robot_name provided, try: \n$$ python stdr_random_walk.py robot[XX] '
			exit()

		print robot1, ' started to walk randomly.'
	try:
        	talker()
    	except rospy.ROSInterruptException:
		pass


