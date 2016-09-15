/* TwoJS http://jonobr1.github.io/two.js/ */
/* color palette http://paletton.com/#uid=32i0B0kmRuDdfKki--+sHsUtYm0 */

/* Library namespace */
var simplemd = simplemd || {};

/* Our namespace function */
(function (smd) {
  var gamewidth = 400
  var gameheight = 300
  var eta = 1.0
  var dt = 0.1
  var a0 = 50
  var rcut = 100.33
  var T = 5

  var game

  var particles

  smd.AddParticleAtMouse = function () {
    smd.AddParticle(game.input.x, game.input.y)
  }

  smd.AddParticle = function (x, y) {
    var particle = game.add.sprite(x, y, 'redparticle')

    particle.anchor.setTo(0.5, 0.5)
    particle.scale.setTo(0.1, 0.1)
    particle.inputEnabled = true
    particle.input.enableDrag(true)
    particle.events.onDragStart.add(smd.StartDragParticle, this)
    particle.events.onDragStop.add(smd.StopDragParticle, this)

    particles.add(particle)
  }

  smd.InitialiseParticles = function () {
    for (var i = 0; i < 16; i++) {
      smd.AddParticle(Math.random() * gamewidth, Math.random() * gameheight)
    }
  }

  smd.UpdateVelocities = function () {
    for (var i = 0; i < particles.length; i++) {
      var fx = 0
      var fy = 0
      for (var j = 0; j < particles.length; j++) {
        var dx = particles.getAt(j).x - particles.getAt(i).x
        var dy = particles.getAt(j).y - particles.getAt(i).y

        if (Math.abs(dx) > gamewidth * 0.5) dx = dx - gamewidth * Math.round(dx / gamewidth)
        if (Math.abs(dy) > gameheight * 0.5) dy = dy - gameheight * Math.round(dy / gameheight)

        var r = Math.sqrt(dx * dx + dy * dy)

        r = (r === 0) ? 0.00001 : r
        var rx = dx / r
        var ry = dy / r

        var f = -2 * r * Math.exp(-r * r / a0 / a0)

        fx += f * rx + T * Math.random() - T / 2.0
        fy += f * ry + T * Math.random() - T / 2.0
      }

      var vx = fx
      var vy = fy

      particles.getAt(i).x += vx * dt
      particles.getAt(i).y += vy * dt
    }

    smd.WrapParticles()
  }

  smd.WrapParticles = function () {
    for (var i = 0; i < particles.length; i++) {
      var x = particles.getAt(i).x
      var y = particles.getAt(i).y
      if (x > gamewidth) particles.getAt(i).x = x - gamewidth
      if (x < 0) particles.getAt(i).x = x + gamewidth
      if (y > gameheight) particles.getAt(i).y = y - gameheight
      if (y < 0) particles.getAt(i).y = y + gameheight
    }
  }

  smd.StartDragParticle = function () {
    //this.loadTexture('redparticle')
  }

  smd.StopDragParticle = function () {
    //this.loadTexture('redparticle')
  }

  // The main application closure
  smd.runApp = function (canvasElem) {
    game = new Phaser.Game(gamewidth, gameheight, Phaser.AUTO, canvasElem)

    var mainState = {
      preload: function () {
        game.stage.backgroundColor = '#ffffff'
        game.load.image('redparticle', 'static/sphere-11.png')
      },
      create: function () {
        var style = {font: '65px Arial', fill: '#ff0044', align: 'center'}
        game.input.onDown.add(smd.AddParticleAtMouse, this)
        particles = game.add.group()
        smd.InitialiseParticles()
      },
      update: function () {
        smd.UpdateVelocities()
      }
    }

    game.state.add('main', mainState)
    game.state.start('main')
  }
})(simplemd)
