# Simple Network Dynamics simulator in Python
#
# *** Network Growth ***
#
# Copyright 2011-2012 Hiroki Sayama
# sayama@binghamton.edu

import matplotlib
matplotlib.use('TkAgg')

import pylab as PL
import networkx as NX
import csv
import math as MT

network_size = 12 # number of robots
data = [[] for i in xrange(network_size)] # initializing an empty list of lists to store data

with open('../../matlab/data/Ex3.txt', 'rb') as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=' ')
    for row in csv_reader:
        t = float(row[0])
        r = int(row[1])
        x = float(row[2])
        y = float(row[3])
        theta = float(row[4])

        data[r-1].append([t,x,y,theta])


def init():
    global time, network, positions, network_size, fitness

    time = 0

    network = NX.Graph()
    positions = {}
    fitness = [0.01] * network_size

    for r in xrange(network_size):
        network.add_node(r)
        positions[r] = (data[r][1][1],data[r][1][2])

    network.add_node("c0")
    network.add_node("c1")
    network.add_node("c2")
    network.add_node("c3")
    network.add_edge("c0","c1");network.add_edge("c1","c3");network.add_edge("c2","c3");network.add_edge("c2","c0")
def draw():

    PL.cla()
    node_color = ['g','g','g','g','g','g',
                      'r','r','r','r','r','r',
                      'y','y','y','y']

    positions["c0"] = (-10,-10); positions["c1"] = (-10,10); positions["c2"] = (10,-10); positions["c3"] = (10,10)
    fitness.append(0); fitness.append(0); fitness.append(0); fitness.append(0)

    NX.draw(network, pos=positions, node_color=node_color, node_size=[300 * MT.pow(f,.5) for f in fitness])
    PL.axis('image')
    PL.title('t = ' + str(data[0][time][0]))


def step():
    global time, network, positions, network_size, fitness

    time += 1
    for r in xrange(network_size):
        positions[r] = (data[r][time][1],data[r][time][2])
        speed = MT.sqrt( MT.pow(data[r][time][1] - data[r][time-1][1], 2)
                       + MT.pow(data[r][time][2] - data[r][time-1][2], 2))

        # fitness[r] = (10000.0 * speed)
        fitness[r] = ( fitness[r] * data[r][time-1][0] + speed ) / data[r][time][0]

        for r2 in xrange(network_size):
            if r != r2:
                distance = MT.sqrt( MT.pow(data[r][time][1] - data[r2][time][1], 2)
                           + MT.pow(data[r][time][2] - data[r2][time][2],2) )
                if distance < 2:
                    network.add_edge(r,r2)
                else:
                    try:
                        network.remove_edge(r,r2)
                    except:
                        pass

import pycxsimulator
pycxsimulator.GUI().start(func=[init,draw,step])
