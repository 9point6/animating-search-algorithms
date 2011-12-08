(function() {
  var KamadaKawai;
  KamadaKawai = (function() {
    function KamadaKawai() {
      this.paths = {};
      this.springs = {};
    }
    KamadaKawai.prototype.dist = function(n1, n2) {
      var d2, dx, dy, result;
      dx = n2.x - n1.x;
      dy = n2.y - n1.y;
      d2 = (dx * dx) + (dy * dy);
      return result = [d2, dx, dy];
    };
    KamadaKawai.prototype.prepare = function() {
      var delta, n, s, _fn, _i, _j, _len, _len2, _ref, _ref2, _ref3, _results;
      s = Math.sqrt(Math.sqrt(APP.graph.nodecount));
      _ref = APP.graph.nodes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        n = _ref[_i];
        _ref2 = [n.x * s, n.y * s], n.x = _ref2[0], n.y = _ref2[1];
      }
      this.shortest_paths();
      this.tolerance = 0.1;
      this.k = 1;
      this.update_springs();
      this.delta_p = -Infinity;
      this.partials = {};
      _ref3 = APP.graph.nodes;
      _fn = function(n) {};
      _results = [];
      for (_j = 0, _len2 = _ref3.length; _j < _len2; _j++) {
        n = _ref3[_j];
        _fn(n);
        this.partials[n.id] = this.compute_partial_derivatives(n);
        delta = this.calculate_delta(this.partials[n.id]);
        _results.push(delta > this.delta_p ? (this.p = n, this.delta_p = delta) : void 0);
      }
      return _results;
    };
    KamadaKawai.prototype.update_springs = function() {
      var dij, i, kd, u, v, _fn, _fn2, _i, _j, _len, _len2, _ref, _ref2, _ref3, _results;
      this.springs = {};
      _ref = APP.graph.nodes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        u = _ref[_i];
        this.springs[u.id] = {};
      }
      _ref2 = APP.graph.nodes;
      _fn = function(i, u) {};
      _results = [];
      for (i in _ref2) {
        u = _ref2[i];
        _fn(i, u);
        _ref3 = APP.graph.nodes.slice(++i);
        _fn2 = function(u, v) {};
        for (_j = 0, _len2 = _ref3.length; _j < _len2; _j++) {
          v = _ref3[_j];
          _fn2(u, v);
          dij = this.paths[u.id][v.id];
          if (dij === Infinity) {
            return false;
          }
          kd = this.k / (dij * dij);
          this.springs[u.id][v.id] = kd;
          this.springs[v.id][u.id] = kd;
        }
      }
      return _results;
    };
    KamadaKawai.prototype.shortest_paths = function() {
      var e, lim, m, n, p, q, qo, u, v, _i, _j, _k, _len, _len2, _len3, _ref, _ref2;
      this.paths = {};
      lim = Math.ceil(Math.sqrt(APP.graph.nodecount));
      _ref = APP.graph.nodes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        u = _ref[_i];
        p = {};
        _ref2 = APP.graph.nodes;
        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
          v = _ref2[_j];
          p[v.id] = lim + 10 * v.weight_to_travel(u);
        }
        p[u.id] = 0;
        e = {};
        e[u.id] = true;
        q = [u];
        qo = 0;
        while (q.length > 0) {
          n = q.reverse().pop();
          q = q.reverse();
          for (_k = 0, _len3 = n.length; _k < _len3; _k++) {
            m = n[_k];
            if (!(e[m.id] != null)) {
              p[m.id] = p[n.id] + 1;
              e[m.id] = true;
              q.push(m);
            }
          }
        }
        this.paths[u.id] = p;
      }
      return this.paths;
    };
    KamadaKawai.prototype.iterate = function() {
      var n, _i, _j, _len, _len2, _ref, _ref2;
      if (APP.graph.nodecount === 0) {
        return;
      }
      _ref = APP.graph.nodes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        n = _ref[_i];
        if (!this.paths || !this.springs || !this.partials || !(this.paths[n.id] != null) || !(this.springs[n.id] != null) || !this.partials[n.id]) {
          this.prepare();
          break;
        }
      }
      this.p_partials = {};
      _ref2 = APP.graph.nodes;
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        n = _ref2[_j];
        this.p_partials[n.id] = this.compute_partial_derivative(n, this.p);
      }
      this.inner_loop();
      this.select_new_p();
      return APP.graph.last_energy = this.delta_p;
    };
    KamadaKawai.prototype.inner_loop = function() {
      var d, d2, delta, dim, i, iter, j, k, lid3, mat, n, pat, spr, _i, _j, _k, _len, _len2, _len3, _ref, _ref2, _results;
      iter = 0;
      this.last_local_energy = Infinity;
      _results = [];
      while (iter < 500 && !this.done(false)) {
        iter++;
        mat = {
          xx: 0,
          yy: 0,
          xy: 0,
          yx: 0
        };
        dim = ['x', 'y'];
        spr = this.springs[this.p.id];
        pat = this.paths[this.p.id];
        d = {};
        _ref = APP.graph.nodes;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          n = _ref[_i];
          if (!(n === this.p)) {
            (function() {})();
            _ref2 = this.dist(this.p, n), d2 = _ref2[0], d.x = _ref2[1], d.y = _ref2[2];
            k = spr[n.id];
            lid3 = pat[n.id] * (1 / (d2 * Math.sqrt(d2)));
            for (_j = 0, _len2 = dim.length; _j < _len2; _j++) {
              i = dim[_j];
              for (_k = 0, _len3 = dim.length; _k < _len3; _k++) {
                j = dim[_k];
                mat[i + j] += i === j ? k * (1 + lid3 * (d[i] * d[i] - d2)) : k * lid3 * d[i] * d[j];
              }
            }
          }
        }
        delta = this.linear_solver(mat, this.partials[this.p.id]);
        this.p.x += delta.x;
        this.p.y += delta.y;
        this.partials[this.p.id] = this.compute_partial_derivatives(this.p);
        _results.push(this.delta_p = this.calculate_delta(this.partials[this.p.id]));
      }
      return _results;
    };
    KamadaKawai.prototype.select_new_p = function() {
      var delta, n, odp, op, opp, _fn, _i, _len, _ref, _results;
      op = this.p;
      _ref = APP.graph.nodes;
      _fn = function(n) {};
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        n = _ref[_i];
        _fn(n);
        odp = this.p_partials[n.id];
        opp = this.compute_partial_derivative(n, op);
        this.partials[n.id].x += opp.x - odp.x;
        this.partials[n.id].y += opp.y - odp.y;
        delta = this.calculate_delta(this.partials[n.id]);
        _results.push(delta > this.delta_p ? (this.p = n, this.delta_p = delta) : void 0);
      }
      return _results;
    };
    KamadaKawai.prototype.linear_solver = function(mat, rhs) {
      var denom, result, x_num, y_num, z_num;
      denom = 1 / (mat.xx * mat.yy - mat.xy * mat.xy);
      x_num = rhs.x * mat.yy - rhs.y * mat.xy;
      y_num = mat.xx * rhs.y - mat.xy * rhs.x;
      z_num = 0;
      result = {
        x: x_num * denom,
        y: y_num * denom
      };
      return result;
    };
    KamadaKawai.prototype.compute_partial_derivative = function(m, i) {
      var d2, dx, dy, k, l, result, _ref;
      result = {
        x: 0,
        y: 0
      };
      if (!(i === m)) {
        _ref = this.dist(m, i), d2 = _ref[0], dx = _ref[1], dy = _ref[2];
        k = this.springs[m.id][i.id];
        l = this.paths[m.id][i.id] / Math.sqrt(d2);
        result.x = k * (dx - l * dx);
        result.y = k * (dy - l * dy);
      }
      return result;
    };
    KamadaKawai.prototype.compute_partial_derivatives = function(m) {
      var add_results, i, result, _i, _len, _ref;
      result = {
        x: 0,
        y: 0
      };
      add_results = function(a, b) {
        a.x += b.x;
        a.y += b.y;
        return a;
      };
      _ref = APP.graph.nodes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        result = add_results(result, this.compute_partial_derivative(m, i));
      }
      return result;
    };
    KamadaKawai.prototype.calculate_delta = function(partial) {
      var ret;
      if (partial[0] != null) {
        partial = partial[0];
      }
      ret = Math.sqrt(partial.x * partial.x + partial.y * partial.y);
      return ret;
    };
    KamadaKawai.prototype.done = function() {
      var diff, done;
      if (this.last_local_energy === Infinity || this.last_local_energy < this.delta_p) {
        this.last_local_energy = this.delta_p;
        return false;
      }
      diff = 1 - Math.abs(this.last_local_energy - this.delta_p) / this.last_local_energy;
      done = (this.delta_p === 0) || (diff < this.tolerance);
      this.last_local_energy = this.delta_p;
      return done;
    };
    return KamadaKawai;
  })();
  this.KamadaKawai = KamadaKawai;
}).call(this);
