clc
close all

data = re_9505_data;
N = size(unique(data(:,2)),1);
dist = 0;
for i = 0 : N-1
    dist(i+1,1) = 0;
    index = find(data(:,2) == i);
    pos = data(index,[1,3,4]);
    for t = 2 : size(pos,1)
        dist(i+1, t) = 1/(t) * ((t-1) * dist(i+1,t-1) + ((pos(t,2) - pos(t-1,2)) ^ 2 + (pos(t,3) - pos(t-1,3)) ^ 2)^.5);
    end
        
    
end

subplot(211)
    plot(dist(1:15,:)','k-.')
    hold on
    plot(dist(16:20,:)','r')
    ylabel('Fitness')
    xlabel('Time')
subplot(212)
    plot(mean(dist(1:10,:)),'k-.')
    hold on
    plot(mean(dist(11:20,:)),'r')
    legend('Cooperators', 'Defectors')
    ylabel('Average Fitness')
    xlabel('Time')
    
C = mean(dist(1:19,:));
D = (dist(20:20,:));
disp(C(end-30))
disp(D(end-30))
disp(C(end-30) / D(end-30))
%% Statistics
%% Statistics
close all

results_regular = [ 
    0.0086,  0.0142, 0.6023; % 05C-95D
    0.0173,  0.0126, 1.2693; % 25C-75D
    0.0160, 0.0118, 2.0578;  % 40C-60D
    0.0182, 0.0090, 1.6517;  % 50C-50D
    0.0180, 0.0064, 1.9108;  % 60C-40D
    0.0252, 0.0082, 2.2500;  % 75C-25D
    0.0255, 0.0099, 1.6038   % 95C-05D
    ]; 

results_smallworld = [ 
    0.0419, 0.0119, 3.5053;
    0.0310, 0.0166, 1.8691;
    0.0295, 0.0165, 1.4818;
    0.0299, 0.0172, 1.5641;
    0.0278, 0.0241, 1.9716; % 60C-40D
    0.0334, 0.0411, 1.9565;
    0.0370, 0.0423, 1.0792  % 95C-05D
    ];


% plotting the statistics

figure
subplot(121)
plot([0.05, .25,.4, .5,.6 ,.75, .95], 10 * results_regular([1,2,3,4,5,6,7],1),'k.-')
hold on
plot([0.05, .25,.4, .5,.6 ,.75, .95], 10 * results_regular([1,2,3,4,5,6,7],2),'r.--')
title('Regular Environment')
xlabel('Ratio of Cooperators to Defectors')
ylabel('Average Fitness')
legend('Cooperators','Defectors')
xlim([.05,.95])
ylim([0,.5])


subplot(122)
plot([0.05, .25,.4, .5,.6 ,.75, .95], 10 * results_smallworld([1,2,3,4,5,6,7],1),'k.-')
hold on
plot([0.05, .25,.4, .5,.6 ,.75, .95], 10 * results_smallworld([1,2,3,4,5,6,7],2),'r.--')
title('Small World Environment')
xlabel('Ratio of Cooperators to Defectors')
ylabel('Average Fitness')
legend('Cooperators','Defectors')
xlim([.05,.95])
ylim([0,.5])


% plotting the statistics

figure
subplot(121)
plot([0.05, .25,.4, .5,.6 ,.75, .95], results_regular([1,2,3,4,5,6,7],1)./results_regular([1,2,3,4,5,6,7],2),'r.--')
title('Regular Environment')
xlabel('Ratio of Cooperators over Defectors')
ylabel('Ratio of F_c to F_d')
xlim([.05,.95])
ylim([0,4])


subplot(122)
plot([0.05, .25,.4, .5,.6 ,.75, .95], results_smallworld([1,2,3,4,5,6,7],1)./results_smallworld([1,2,3,4,5,6,7],2),'r.--')
title('Small World Environment')
xlabel('Ratio of Cooperators over Defectors')
ylabel('Ratio of F_c to F_d')
xlim([.05,.95])
ylim([0,4])

              



              


