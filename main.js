/* Copyright МИНА License 2002-2018 */

window.bugCount = 5;
window.bugs = [];
window.stopAnimationEvent = false;

function run()
{
    for (var i = 0; i < bugs.length; i++)
    {
        if (stopAnimationEvent)
            return;

        move(i);
        animate(i);
    }
}

function animate(i)
{
    if (stopAnimationEvent)
        return;

    if (bugs[i])
    {
        if (bugs[i].hasClass('bug1_lr') || bugs[i].hasClass('bug2_lr'))
        {
            bugs[i].toggleClass('bug1_lr');
            bugs[i].toggleClass('bug2_lr');
            hasBugs = true;
        }
        else if (bugs[i].hasClass('bug1_rl') || bugs[i].hasClass('bug2_rl'))
        {
            bugs[i].toggleClass('bug1_rl');
            bugs[i].toggleClass('bug2_rl');
            hasBugs = true;
        }
    }
    
    if (!stopAnimationEvent)
        setTimeout(function() { animate(i); }, 100 - bugs[i].speed * 2);
}

function move(i)
{
    if (stopAnimationEvent)
        return;

    if (bugs[i])
    {
        var step = bugs[i].speed;
        var change = false;
        if (bugs[i].hasClass('bug1_lr') || bugs[i].hasClass('bug2_lr'))
        {
            change = {"left": "+=" + step + "px"};
        }
        else if (bugs[i].hasClass('bug1_rl') || bugs[i].hasClass('bug2_rl'))
        {
            change = {"left": "-=" + step + "px"};
        }
        
        if (change)
        {
            bugs[i].animate(change, 30, function()
            {
                var bug = $(this);

                var bgp = bug.position();
                if (bgp.left >= $('#bugs').width() - 90)
                {
                    if (bug.hasClass('bug1_lr') || bug.hasClass('bug2_lr'))
                    {
                        bug.removeClass('bug1_lr');
                        bug.removeClass('bug2_lr');
                        bug.addClass('bug1_rl');
                    }
                }
                else if (bgp.left <= 0)
                {
                    if (bug.hasClass('bug1_rl') || bug.hasClass('bug2_rl'))
                    {
                        bug.removeClass('bug1_rl');
                        bug.removeClass('bug2_rl');
                        bug.addClass('bug1_lr');
                    }
                }

                if (!stopAnimationEvent)
                    setTimeout(function() { move(i); }, 1);
            });
        }
    }
}

function restart()
{
    clear_bugs();

    var bugs_div = $('#bugs');
    var pos = bugs_div.position();
    
    var bugvec = ['bug1_lr', 'bug2_lr', 'bug1_rl', 'bug2_rl'];
    for (var i = 0; i < bugCount; i++)
    {
        var bug = $('<div class="' + bugvec[Math.floor(Math.random() * bugvec.length)] + ' bug' + '"></div>');
        bugs_div.append(bug);
        var newPos = { top: pos.top, left: Math.floor(Math.random() * (bugs_div.width() - bug.width() + 1)) };
        bug.offset(newPos);
        bug.speed = Math.floor(Math.random() * 20) + 1;
        bugs.push(bug);
    }
    
    run();
}

function clear_bugs()
{
    stopAnimationEvent = true;
    $('#you_win').hide();
    $('.bug').remove();
    bugs = [];
    stopAnimationEvent = false;
}

$(function()
{
    // settings
    $('#count').val(bugCount);
    $('#count').change(function ()
    {
        bugCount = parseInt($(this).val());
        if (isNaN(bugCount))
            bugCount = 5;
    });
    
    $('#closesettings').click(function ()
    {
        $('#settings').hide();
    });
    
    $('#closewin').click(function ()
    {
        clear_bugs();
    });
    
    $('#showsett').click(function ()
    {
        $('#settings').show();
        clear_bugs();
    });
    
    // about
    $('#closeabout').click(function ()
    {
        $('#about').hide();
    });
    
    $('#showabout').click(function ()
    {
        $('#about').show();
    });

    // leng
    $('#bot').click(function()
    {
        $('#shirt').animate({height: ($('body').height() - 115) + 'px'}, 100, function()
        {
            var leng = $('#leng');
            var lengpos = leng.position();
            for (var i = 0; i < bugs.length; i++)
            {
                var bgp = bugs[i].position();
                if (bgp.left > lengpos.left && bgp.left < (lengpos.left + leng.width()) ||
                    (bgp.left + bugs[i].width()) < (lengpos.left + leng.width()) && (bgp.left + bugs[i].width()) > lengpos.left)
                {
                    if (bugs[i].hasClass('bug1_lr') || bugs[i].hasClass('bug2_lr'))
                    {
                        bugs[i].removeClass('bug1_lr');
                        bugs[i].removeClass('bug2_lr');
                        bugs[i].addClass('bug_press_lr');
                        break;
                    }
                    else if (bugs[i].hasClass('bug1_rl') || bugs[i].hasClass('bug2_rl'))
                    {
                        bugs[i].removeClass('bug1_rl');
                        bugs[i].removeClass('bug2_rl');
                        bugs[i].addClass('bug_press_rl');
                        break;
                    }
                }
            }
            $(this).animate({height : '0px'}, 200);
            var in_life = $('#bugs .bug').not('.bug_press_rl').not('.bug_press_lr').length;
            if (bugs.length > 0 && in_life <= 0)
                $('#you_win').show();
        });
    });
    
    // start
    $('#start').click(restart);
});